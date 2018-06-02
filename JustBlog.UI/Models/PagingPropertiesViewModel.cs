//using JustBlog.Models;
//using JustBlog.UI.Infrastructure;
//using System;
//using System.Linq.Expressions;
//using System.Web.Mvc;

//namespace JustBlog.UI.Models
//{
//    /// <summary>
//    /// View model class for PagingProperties. This class is
//    /// used strictly for model binding and exists to keep system.web.mcv
//    /// out of the domain layer.
//    /// 
//    /// Note: This will only serialize correct for Web API when used with
//    /// a Http POST method.
//    /// </summary>
//    /// <typeparam name="T"></typeparam>
//    [ModelBinder(typeof(PagingPropertiesBinder))] //Mvc Model Binder
//    [System.Web.Http.ModelBinding.ModelBinder(typeof(PagingPropertiesBinderWebApi))] //Web Api Modelbinder
//    [Obsolete("Oboslete view model used for model binding. Do not use.")]
//    public class PagingPropertiesViewModel<T> : PagingProperties<T> where T : class, new()
//    {
//        /// <summary>
//        /// Default constructor. This is required to initialize a new PagingProperties object in the paging propeties model binder.
//        /// </summary>
//        public PagingPropertiesViewModel() : base() { }

//        /// <summary>
//        /// Explicit constructor for specifying an initial sort field
//        /// </summary>
//        /// <param name="field"></param>
//        public PagingPropertiesViewModel(Expression<Func<T, object>> field) : base(field) { }

//        /// <summary>
//        /// Explicit constuctor for specifying an initial sort field and sort direction
//        /// </summary>
//        /// <param name="field"></param>
//        /// <param name="isAscending"></param
//        public PagingPropertiesViewModel(Expression<Func<T, object>> field, bool isAscending) : base(field, isAscending) { }
//    }
//}