//using JustBlog.Models;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Reflection;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Web.Http;
//using System.Web.Http.Controllers;
//using System.Web.Http.Metadata;

//namespace JustBlog.UI.Infrastructure
//{
//    /// <summary>
//    /// Custom query and paging properties parameter binder
//    /// </summary>
//    public class PagingPropertiesParameterBinder : HttpParameterBinding
//    {
//        private readonly HttpParameterBinding _paramaterBinding;
//        private readonly HttpParameterDescriptor _httpParameterDescriptor;
//        private const int ENTITY_GENERIC_INDEX = 0;

//        public PagingPropertiesParameterBinder(HttpParameterDescriptor descriptor) : base(descriptor)
//        {
//            _httpParameterDescriptor = descriptor;
//            _paramaterBinding = new FromBodyAttribute().GetBinding(descriptor);
//        }

//        /// <summary>
//        /// Execute default parameter binding. This will call the default model binder but replace any query paging properties
//        /// with the correctly typed paging properties.
//        /// </summary>
//        /// <param name="metadataProvider"></param>
//        /// <param name="actionContext"></param>
//        /// <param name="cancellationToken"></param>
//        /// <returns></returns>
//        public override async Task ExecuteBindingAsync(ModelMetadataProvider metadataProvider, HttpActionContext actionContext, CancellationToken cancellationToken)
//        {
//            // Must do this in order to reread the content body. FML...
//            await actionContext.Request.Content.LoadIntoBufferAsync();

//            // Execute the default parameter binding
//            await _paramaterBinding.ExecuteBindingAsync(metadataProvider, actionContext, cancellationToken);

//            Type entityType = _httpParameterDescriptor.ParameterType.GenericTypeArguments[ENTITY_GENERIC_INDEX];

//            // now try to read the content as string
//            string bodyContent = await actionContext.Request.Content.ReadAsStringAsync();

//            if (entityType == null)
//            {
//                throw new PagingPropertiesException("Query Parameter Binding Exception: Could not determine the entity type of the query model");
//            }

//            if (string.IsNullOrEmpty(bodyContent))
//            {
//                throw new PagingPropertiesException("Query Parameter Binding Exception: Could not read contents of of the request body.");
//            }

//            var pagingPropertiesTypeObject = createTypedPagingProperties(bodyContent, entityType);
//            var queryModel = actionContext.ActionArguments[_httpParameterDescriptor.ParameterName];

//            // Set the paging properties of the query object
//            queryModel.GetType().InvokeMember(nameof(Query<object, StandardFilter>.PagingProperties),
//                                                                BindingFlags.Instance | BindingFlags.Public | BindingFlags.SetProperty,
//                                                                Type.DefaultBinder, queryModel, new object[] { pagingPropertiesTypeObject });

//            actionContext.ActionArguments[_httpParameterDescriptor.ParameterName] = queryModel;
//        }

//        /// <summary>
//        /// Create a typed paging properties object based on the contents of the body. Note, you must pass in a
//        /// correctly formatted json paging properties object to parse this.
//        /// </summary>
//        /// <param name="actionContext"></param>
//        /// <param name="entityType"></param>
//        /// <returns></returns>
//        private object createTypedPagingProperties(string bodyContents, Type entityType)
//        {
//            try
//            {
//                // Create PagingProperties object
//                object pagingPropertyObject = createPagingPropertyObject(entityType);

//                // Generate property info for the paging properties
//                PropertyInfo indexPropertyInfo = getPagingPropertyInfo(nameof(PagingProperties<object>.Index), pagingPropertyObject);
//                PropertyInfo pageSizePropertyInfo = getPagingPropertyInfo(nameof(PagingProperties<object>.PageSize), pagingPropertyObject);
//                PropertyInfo totalPagesPropertyInfo = getPagingPropertyInfo(nameof(PagingProperties<object>.TotalPages), pagingPropertyObject);
//                PropertyInfo totalResultsPropertyInfo = getPagingPropertyInfo(nameof(PagingProperties<object>.TotalResults), pagingPropertyObject);
//                PropertyInfo defaultPageSizePropertyInfo = getPagingPropertyInfo(nameof(PagingProperties<object>.DefaultPageSize), pagingPropertyObject);

//                Dictionary<string, object> postBodyValues = JsonConvert.DeserializeObject<Dictionary<string, object>>(bodyContents);
//                string pagingPropertiesKey = nameof(PagingProperties<object>);

//                if (!postBodyValues.ContainsKey(pagingPropertiesKey))
//                {
//                    throw new PagingPropertiesException($"Paging Properties Exception: PagingProperties not found " +
//                                                    "in the post body. Did you forget to include the \"PagingProperties\" json object?");
//                }

//                // Convert to paging properties obejct that we can then build our typed object out of
//                PagingProperties<object> propertiesJsonObject = JsonConvert.DeserializeObject<PagingProperties<object>>(
//                                                                                    postBodyValues[pagingPropertiesKey].ToString());

//                if (propertiesJsonObject != null)
//                {
//                    indexPropertyInfo.SetValue(pagingPropertyObject, propertiesJsonObject.Index, null);
//                    pageSizePropertyInfo.SetValue(pagingPropertyObject, propertiesJsonObject.PageSize, null);
//                    totalPagesPropertyInfo.SetValue(pagingPropertyObject, propertiesJsonObject.TotalPages, null);
//                    totalResultsPropertyInfo.SetValue(pagingPropertyObject, propertiesJsonObject.TotalResults, null);
//                }

//                // Add sorting fields
//                foreach (var sortField in propertiesJsonObject.SortFields)
//                {
//                    // Create new SortField
//                    object newSortfield = createSortField(entityType, sortField?.ToString(), sortField?.IsAscending);

//                    pagingPropertyObject.GetType().GetMethod(nameof(PagingProperties<object>.AddField))
//                                                                            .Invoke(pagingPropertyObject, new object[] { newSortfield });
//                }

//                return pagingPropertyObject;
//            }
//            catch (Exception ex)
//            {
//                throw new PagingPropertiesException("Paiging Properties Exception", ex);
//            }
//        }

//        /// <summary>
//        /// Create a generic paging properties object
//        /// </summary>
//        /// <param name="bindingContext"></param>
//        /// <returns></returns>
//        private object createPagingPropertyObject(Type sortType)
//        {
//            // Get the generic type
//            Type pagingPropertyType = typeof(PagingProperties<>);

//            Type[] pagingPropertyGenericModelType = { sortType };
//            Type genericPagingPropertyType = pagingPropertyType.MakeGenericType(pagingPropertyGenericModelType);
//            return Activator.CreateInstance(genericPagingPropertyType);
//        }

//        /// <summary>
//        /// Get secific a specfic public instance property from a PagingProperties object
//        /// </summary>
//        /// <param name="propertyName"></param>
//        /// <param name="pagingPropertyObject"></param>
//        /// <returns></returns>
//        private PropertyInfo getPagingPropertyInfo(string propertyName, object pagingPropertyObject)
//        {
//            PropertyInfo info = pagingPropertyObject.GetType().GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);

//            if (info == null)
//            {
//                throw new PagingPropertiesException($"Paging Properties Parameter Binder Exception: Could not locate property \"{propertyName}.\" in the http request.");
//            }

//            return info;
//        }

//        /// <summary>
//        /// Create a SortField object
//        /// </summary>
//        /// <param name="sortType"></param>
//        /// <param name="field"></param>
//        /// <param name="isAscending"></param>
//        /// <returns></returns>
//        private object createSortField(Type sortType, string field, bool? isAscending)
//        {
//            if (!string.IsNullOrEmpty(field) || !isAscending.HasValue)
//            {
//                // Get the generic type
//                Type sortFieldType = typeof(SortField<>);


//                Type[] sortFieldGenericType = { sortType };
//                Type genericSortFieldType = sortFieldType.MakeGenericType(sortFieldGenericType);

//                object[] constructorArguments = new object[] { field, isAscending.Value };
//                return Activator.CreateInstance(genericSortFieldType, constructorArguments);
//            }
//            else
//            {
//                throw new PagingPropertiesException("Paging Properties Error: Sort field or sort direction was not specified.");
//            }
//        }
//    }
//}