using System.Collections.Generic;

namespace JustBlog.Models
{
    /// <summary>
    /// Interface for the paging properties model type. Used to safe guard against changes to
    /// the implementation.
    /// </summary>
    /// <typeparam name="T"> Entity Model Type</typeparam>
    public interface IPagingProperties<T> where T : class, new()
    {
        /// <summary>
        /// The default page size of the results. This number must be greater than 0.
        /// </summary>
        int DefaultPageSize { get; }

        /// <summary>
        /// The current page of the data set.
        /// </summary>
        int Index { get; set; }

        /// <summary>
        /// Current number of results shown in the page set.
        /// </summary>
        int PageSize { get; set; }

        /// <summary>
        /// The sort fields for a query
        /// </summary>
        List<SortField<T>> SortFields { get; set; }

        /// <summary>
        /// Total number of pages if all results are returned.
        /// </summary>
        int TotalPages { get; set; }

        /// <summary>
        /// The total number of results in a query.
        /// </summary>
        int TotalResults { get; set; }

        /// <summary>
        /// Add a field to the list of fields to sort by.
        /// This makes it easier to add fields in model binding.
        /// </summary>
        /// <param name="field"></param>
        void AddField(SortField<T> field);
    }
}