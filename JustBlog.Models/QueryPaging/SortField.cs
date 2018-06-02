using Newtonsoft.Json;
using System;
using System.Linq.Expressions;
using System.Reflection;

namespace JustBlog.Models
{
    /// <summary>
    /// Helper class for organizing sort expressions in LINQ queries.
    /// Inspiration taken from Mark Gravell, Sanchitos, Nawfal and poke at Stack Overflow -
    /// http://stackoverflow.com/questions/41244/dynamic-linq-orderby-on-ienumerablet
    /// http://stackoverflow.com/questions/729295/how-to-cast-expressionfunct-datetime-to-expressionfunct-object
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public sealed class SortField<T> : ISortField<T> where T : class, new()
    {
        private readonly bool DEFAULT_IS_SORT_ASCENDING = true;

        /// <summary>
        /// Private variable to hold the field expression
        /// </summary>
        private Expression<Func<T, object>> _fieldExpression;

        /// <summary>
        /// Default the sort order to ascending
        /// </summary>
        public SortField()
        {
            _initialize(null, null, null);
        }

        /// <summary>
        /// Explicit Constructor for sorting by a specific property from type T
        /// </summary>
        /// <param name="field"></param>
        public SortField(string field)
        {
            _initialize(null, field, null);
        }

        /// <summary>
        /// Explicit constructor for sorting by specific contructor
        /// </summary>
        /// <param name="selector"></param>
        public SortField(Expression<Func<T, object>> selector)
        {
            _initialize(selector, null, null);
        }

        /// <summary>
        /// Explicit constructor for sorting by a specific property in a 
        /// specific direction
        /// </summary>
        /// <param name="selector"></param>
        /// <param name="isAscending"></param>
        public SortField(Expression<Func<T, object>> selector, bool isAscending)
        {
            _initialize(selector, null, isAscending);
        }

        /// <summary>
        /// Explicit Constructor for sorting by a specific field and in a 
        /// specific direction
        /// </summary>
        /// <param name="field"></param>
        /// <param name="isAscending"></param>
        public SortField(string field, bool isAscending)
        {
            _initialize(null, field, isAscending);
        }

        /// <summary>
        /// The function delegate field we are sorting by
        /// </summary>
        [JsonIgnore]
        public Expression<Func<T, object>> Field
        {
            get
            {
                return _fieldExpression;
            }
            set
            {
                _fieldExpression = value;
                _field = expressionToStringField(value);
            }
        }

        /// <summary>
        /// Direction of the sort
        /// </summary>
        public bool IsAscending { get; set; }

        /// <summary>
        /// This is used for serialization
        /// </summary>
        [JsonProperty(PropertyName = "Field")]
        private string _field { get; set; }

        /// <summary>
        /// Overriding the ToString() method
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return _field;
        }

        /// <summary>
        /// Initialize the object based on the required parameters
        /// </summary>
        private void _initialize(Expression<Func<T, object>> selector, string field, bool? isAscending)
        {
            if(selector != null && !string.IsNullOrEmpty(field))
            {
                throw new Exception("Sort field initializer can not take both an expression field and string field on initialization.");
            }

            IsAscending = isAscending.HasValue ? isAscending.Value : DEFAULT_IS_SORT_ASCENDING;

            if (selector != null)
            {
                Field = selector;
            }
            else if (!string.IsNullOrEmpty(field))
            {
                Field = createFunctionDelegate(field);
            }
        }
        /// <summary>
        /// Create a function delegate that returns an object from a string. The string must be 
        /// a member property of T
        /// </summary>
        /// <param name="property"></param>
        /// <returns></returns>
        private Expression<Func<T, object>> createFunctionDelegate(string property)
        {
            //Remove leading and trailing whitespace
            property = property.Trim();

            string[] props = property.Split('.');
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "x");
            Expression expr = arg;
            foreach (string prop in props)
            {
                PropertyInfo pi = type.GetProperty(prop);

                //Incorrect property name was added as asort field
                if(pi == null)
                {
                    throw new NullReferenceException($"Propery \"{property}\" could not be found on hte paging model of {typeof(T)}");
                }

                expr = Expression.Property(expr, pi);
                type = pi.PropertyType;
            }

            Type delegateType = typeof(Func<,>).MakeGenericType(typeof(T), type);
            var lambda = Expression.Lambda(delegateType, expr, arg);

            Expression convertedExpression = Expression.Convert(lambda.Body, typeof(object));
            return Expression.Lambda<Func<T, object>>(convertedExpression, lambda.Parameters);
        }

        /// <summary>
        /// Convert an expression to a string field. This is saved for serialization if it occurs.
        /// </summary>
        /// <returns></returns>
        private string expressionToStringField(Expression<Func<T, object>> selector)
        {
            //UnaryExpression unaryExpression = selector.Body as UnaryExpression;
            //MemberExpression propertyExpression = (MemberExpression)unaryExpression.Operand;

            UnaryExpression unaryExpression = selector.Body as UnaryExpression;
            MemberExpression propertyExpression;
            
            //Check if we have a unary or binary expression
            if(unaryExpression != null)
            {
               propertyExpression  = (MemberExpression)unaryExpression.Operand;
            }
            else
            {
                propertyExpression = selector.Body as MemberExpression;
            }

            return propertyExpression.Member.Name;
        }
    }
}
