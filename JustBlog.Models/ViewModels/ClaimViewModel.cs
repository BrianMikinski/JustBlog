namespace JustBlog.ViewModels
{
    /// <summary>
    /// Actions that can performed on resources
    /// </summary>
    public enum Actions
    {
        CREATE,
        READ,
        UPDATE,
        DELETE
    }

    /// <summary>
    /// Resources that actions can act on
    /// </summary>
    public enum Resources
    {
        App,
        Admin
    }

    /// <summary>
    /// Clientside claims models
    /// </summary>
    public class ClaimViewModel
    {
        public string Action { get; set; }

        public string Resource { get; set; }
    }
}
