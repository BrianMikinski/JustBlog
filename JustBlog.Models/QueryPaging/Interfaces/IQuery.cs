using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace JustBlog.Models
{
    /// <summary>
    /// Helper class for organizing database queries
    /// Inspiration taken from Mark Gravell, Sanchitos, Nawfal and poke at Stack Overflow -
    /// http://stackoverflow.com/questions/41244/dynamic-linq-orderby-on-ienumerablet
    /// http://stackoverflow.com/questions/729295/how-to-cast-expressionfunct-datetime-to-expressionfunct-object
    /// </summary>
    public interface IQuery<T, TFilter>
                where T : class, new()
                where TFilter : class, IQueryFilter, new()
    {
        /// <summary>
        /// Object that must inherit from the query filter object. Hold any of the
        /// parameters
        /// </summary>
        TFilter Filter { get; set; }

        /// <summary>
        /// Object to hold all the properties necessary to page a data set
        /// </summary>
        IPagingProperties<T> PagingProperties { get; set; }

        /// <summary>
        /// IQueryable object used for sorting and paging
        /// </summary>
        [JsonIgnore]
        IQueryable<T> Queryable { get; set; }

        /// <summary>
        /// Results set from executing the Queryable
        /// </summary>
        List<T> Results { get; set; }

        /// <summary>
        /// Page but do not sort all of the items in the table. Will not work with
        /// LINQ to Entities - i.e. => Entity Framework
        /// </summary>
        void Page();

        /// <summary>
        /// Page and sort ascending by the specified field
        /// </summary>
        /// <param name="field"></param>
        void SortAndPage(Expression<Func<T, object>> field);

        /// <summary>
        /// Page and sort by the specified field and direction
        /// </summary>
        /// <param name="field"></param>
        void SortAndPage(Expression<Func<T, object>> field, bool isAscending);

        /// <summary>
        /// Page and sort by a set of fields
        /// </summary>
        /// <param name="fields"></param>
        void SortAndPage(List<SortField<T>> fields);

        /// <summary>
        /// Sort and page by a set of fields and directions
        /// </summary>
        /// <param name="fields"></param>
        /// <param name="sortDirections"></param>
        void SortAndPage(List<SortField<T>> fields, List<bool> sortDirections);

        /// <summary>
        /// Sort and page data from a linq query
        /// </summary>
        void SortAndPage();
    }
}
