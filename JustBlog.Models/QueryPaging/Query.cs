using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Serialization;

namespace JustBlog.Models
{
    [Serializable]
    [DataContract]
    public class Query<T, TFilter> : QueryBase, IQuery<T, TFilter>
        where T : class, new()
        where TFilter : class, IQueryFilter, new()
    {
        private const string ORDER_BY = "OrderBy";
        private const string ORDER_BY_DESCENDING = "OrderByDescending";
        private const string THEN_BY = "ThenBy";
        private const string THEN_BY_DESCENDING = "ThenByDescending";

        public Query()
        {
            _initialize(null, null, null);
        }

        /// <summary>
        /// Explicit constructor for specifying query paging properties.
        /// </summary>
        /// <param name="pagingProperties"></param>
        public Query(IPagingProperties<T> pagingProperties)
        {
            _initialize(null, null, pagingProperties);
        }

        [DataMember]
        public TFilter Filter { get; set; }

        [DataMember]
        public virtual IPagingProperties<T> PagingProperties { get; set; }

        [JsonIgnore]
        public virtual IQueryable<T> Queryable { get; set; }

        [DataMember]
        public List<T> Results { get; set; }

        public void Page()
        {
            _sortAndPage(false);
        }
   
        public void SortAndPage(Expression<Func<T, object>> field)
        {
            PagingProperties.SortFields.Clear();
            PagingProperties.SortFields.Add(new SortField<T>(field));
            _sortAndPage(true);
        }
        
        public void SortAndPage(Expression<Func<T, object>> field, bool isAscending)
        {
            PagingProperties.SortFields.Clear();
            PagingProperties.SortFields.Add(new SortField<T>(field, isAscending));
            _sortAndPage(true);
        }
   
        public void SortAndPage(List<SortField<T>> fields)
        {
            PagingProperties.SortFields.Clear();
            PagingProperties.SortFields = fields;
            _sortAndPage(true);
        }
      
        public void SortAndPage(List<SortField<T>> fields, List<bool> sortDirections)
        {
            if (fields.Count != sortDirections.Count)
            {
                throw new Exception();
            }

            throw new NotImplementedException();
        }
        
        public void SortAndPage()
        {
            _sortAndPage(true);
        }

        /// <summary>
        /// Intialize the query with the specified property values
        /// </summary>
        /// <param name="_filter"></param>
        /// <param name="_results"></param>
        /// <param name="_pagingProperties"></param>
        private void _initialize(TFilter _filter, List<T> _results, IPagingProperties<T> _pagingProperties)
        {
            if (_filter == null)
            {
                Filter = new TFilter();
            }
            else
            {
                Filter = _filter;
            }

            if (_results == null)
            {
                Results = new List<T>();
            }
            else
            {
                Results = _results;
            }

            if (_pagingProperties == null)
            {
                PagingProperties = new PagingProperties<T>();
            }
            else
            {
                PagingProperties = _pagingProperties;
            }
        }

        /// <summary>
        /// Implementation of the sort and page method
        /// </summary>
        /// <param name="sortResults"></param>
        private void _sortAndPage(bool sortResults)
        {
            if (Queryable == null)
            {
                throw new NotImplementedException("No queryable has been assigned");
            }

            if (PagingProperties.SortFields.Count() == 0 && sortResults)
            {
                throw new NotImplementedException("No sort definitions are present");
            }

            //You must have the count of objects for the query if you want to select a page
            //from the results set
            int totalRecords = Queryable.Count();
            if (totalRecords > 0)
            {
                int pages = totalRecords / PagingProperties.PageSize;
                int remainingRecords = totalRecords % PagingProperties.PageSize;
                var orderedQuery = Queryable;

                if (remainingRecords > 0)
                {
                    pages++;
                }

                if (pages <= PagingProperties.Index)
                {
                    PagingProperties.Index = 0;
                }

                if (sortResults)
                {
                    SortField<T> firstField = PagingProperties.SortFields.First();

                    ///Get the first sort field
                    if (firstField.IsAscending)
                    {
                        orderedQuery = OrderyBy(Queryable, firstField.Field);
                    }
                    else
                    {
                        orderedQuery = OrderyByDescending(Queryable, firstField.Field);
                    }

                    //Get all subsequent sort fields
                    foreach (var sortField in PagingProperties.SortFields.Skip(1))
                    {
                        if (sortField.IsAscending)
                        {
                            orderedQuery = ThenBy(orderedQuery, sortField.Field);
                        }
                        else
                        {
                            orderedQuery = ThenByDescending(orderedQuery, sortField.Field);
                        }
                    }

                    Queryable = orderedQuery;
                }

                //Perform the actual query
                Queryable = Queryable.Skip(PagingProperties.Index * PagingProperties.PageSize).Take(PagingProperties.PageSize);
                Results = Queryable.ToList();

                //Set the important results
                PagingProperties.TotalPages = pages;
                PagingProperties.TotalResults = totalRecords;
            }
        }

        /// <summary>
        /// Decompose a sort field and apply and apply a linq order command
        /// </summary>
        /// <param name="source"></param>
        /// <param name="sortMethod"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        private IOrderedQueryable<T> ApplyOrder(IQueryable<T> source, Expression<Func<T, object>> field, string sortMethod)
        {
            //Decompose the original expression
            UnaryExpression unaryExpression = field.Body as UnaryExpression;
            MemberExpression propertyExpression;

            if (unaryExpression != null)
            {
                propertyExpression = (MemberExpression)unaryExpression.Operand;
            }
            else
            {
                propertyExpression = field.Body as MemberExpression;
            }

            //Build a new expression of the correct type
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "x");
            Expression expr = arg;

            expr = Expression.Property(expr, propertyExpression.Member.Name);

            Type fieldtype = propertyExpression.Type;

            Type delegateType = typeof(Func<,>).MakeGenericType(typeof(T), fieldtype);
            LambdaExpression lambda = Expression.Lambda(delegateType, expr, arg);

            //Add the new lambda expression to be executed with the specified sort method - OrderBy, OrderByDescending, ThenBy, ThenByDescending
            object result = typeof(Queryable).GetMethods().Single(
                                                    method => method.Name == sortMethod
                                                            && method.IsGenericMethodDefinition
                                                            && method.GetGenericArguments().Length == 2
                                                            && method.GetParameters().Length == 2)
                                                    .MakeGenericMethod(typeof(T), fieldtype)
                                                    .Invoke(null, new object[] { source, lambda });
            return (IOrderedQueryable<T>)result;
        }

        /// <summary>
        /// Order ascending by the specified field
        /// </summary>
        /// <param name="source"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        private IOrderedQueryable<T> OrderyBy(IQueryable<T> source, Expression<Func<T, object>> field)
        {
            return ApplyOrder(source, field, ORDER_BY);
        }

        /// <summary>
        /// Order descending by the specified field
        /// </summary>
        /// <param name="source"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        private IOrderedQueryable<T> OrderyByDescending(IQueryable<T> source, Expression<Func<T, object>> field)
        {
            return ApplyOrder(source, field, ORDER_BY_DESCENDING);
        }

        /// <summary>
        /// Then by descending by the specified field
        /// </summary>
        /// <param name="source"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        private IOrderedQueryable<T> ThenBy(IQueryable<T> source, Expression<Func<T, object>> field)
        {
            return ApplyOrder(source, field, THEN_BY);
        }

        /// <summary>
        /// Then by descending by the specified field
        /// </summary>
        /// <param name="source"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        private IOrderedQueryable<T> ThenByDescending(IQueryable<T> source, Expression<Func<T, object>> field)
        {
            return ApplyOrder(source, field, THEN_BY_DESCENDING);
        }

    } 
}