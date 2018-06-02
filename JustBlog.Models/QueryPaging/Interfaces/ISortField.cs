using System;
using System.Linq.Expressions;

namespace JustBlog.Models
{
    public interface ISortField<T> where T : class, new()
    {
        Expression<Func<T, object>> Field { get; set; }

        bool IsAscending { get; set; }

        string ToString();
    }
}