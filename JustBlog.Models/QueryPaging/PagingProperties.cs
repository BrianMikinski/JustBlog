using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace JustBlog.Models
{
    /// <summary>
    /// Class to hold properties needed to page data
    /// </summary>
    /// <typeparam name="T">The type of the result we are returning.</typeparam>
    public class PagingProperties<T> : IPagingProperties<T> where T : class, new()
    {
        private readonly int DEFAULT_PAGE_SIZE = 10;

        public PagingProperties()
        {
            _initialize(null, null);
        }

        /// <summary>
        /// Explicit constructor used to sort fields to a new paging properties object
        /// </summary>
        /// <param name="sortFields"></param>
        public PagingProperties(List<SortField<T>> sortFields) {
            SortFields = sortFields;
            PageSize = DefaultPageSize;
        }

        /// <summary>
        /// Explicit constructor for specifying an initial sort field
        /// </summary>
        /// <param name="field"></param>
        public PagingProperties(Expression<Func<T, object>> field)
        {
            _initialize(field, null);
        }

        /// <summary>
        /// Explicit constuctor for specifying an initial sort field and sort direction
        /// </summary>
        /// <param name="field"></param>
        /// <param name="isAscending"></param>
        public PagingProperties(Expression<Func<T, object>> field, bool isAscending)
        {
            _initialize(field, isAscending);
        }
    
        public int DefaultPageSize { get { return DEFAULT_PAGE_SIZE; } }
       
        public int Index { get; set; }
        
        public int PageSize { get; set; }
       
        public List<SortField<T>> SortFields { get; set; }
        
        public int TotalPages { get; set; }
        
        public int TotalResults { get; set; }
        
        public void AddField(SortField<T> field)
        {
            SortFields.Add(field);
        }

        /// <summary>
        /// Initialize the object with the specific default sorting values
        /// </summary>
        /// <param name="field"></param>
        /// <param name="isAscending"></param>
        private void _initialize(Expression<Func<T, object>> field, bool? isAscending)
        {
            SortFields = new List<SortField<T>>();
            PageSize = DefaultPageSize;

            if(field != null)
            {
                bool _isAscending = isAscending.HasValue ? isAscending.Value : true;
                SortField<T> newField = new SortField<T>(field, _isAscending);
                SortFields.Add(newField);
            }
        }
    }
}
