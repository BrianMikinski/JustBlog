# JustBlog Custom Angular Demo App

This project is designed to be a demo application for modern front end app development
using Angular Js and the Microsoft Asp.Net stack. It is used to explore pragmatic web app development.

1. Angular 1.x
    * TypeScript
    * Jasmine
    * Karma
    * Protractor __(Coming Soon)__
2. ASP.NET Core
3. Entity Framework Core
4. SQL Server 2016
7. DISQUS __(Coming Soon)__

# Steps to Build

1. Run Visual Studio 2017
2. Checkout source code from dev
4. Create a database in __"(localdb)\ProjectsV13"__ called __"JustBlog"__
5. Add a new sql server user login named __"JustBlogUser"__ with the password __"JustBlogPa$$word1"__.
    Grant the user __"[dbowner]"__ permissions. This user will be used for database migrations and seeding
     but obviously should not be created in a production environment.
3. Run entity framework migrations for the JustBlog and Microsoft .Net Identity 
    database to deploy database and setup test data.These actions require
    the use of the previously created sql account. The following commands should be 
    run from the __Package Manager Console__ -
  - __Update-Database -ConfigurationTypeName "JustBlog.Models.Migrations.JustBlogDbConfiguration" -ProjectName "JustBlog.Models"__ 
  - __Update-Database -ConfigurationTypeName "JustBlog.IdentityManagement.Migrations.IdentityDbConfiguration" -ProjectName "JustBlog.IdentityManagement"__
4. Bower Install
5. NPM Install

# EF 6.X Code First Migrations
DbContext Migrations are generally easier to run if they are separated by project. For this
reason the blog db context is in the Models folder project and the Asp.NET identity database
is in the JustBlog.UI project due to dependencies on OWIN. To deploy or migrate an entity framework migration,
use the following steps

## Redeploy or Initial Deployement of Databases
1. __Update-Database -ConfigurationTypeName "JustBlog.Models.Migrations.JustBlogDbConfiguration" -ProjectName "JustBlog.Models"__ 
2. __Update-Database -ConfigurationTypeName "JustBlog.IdentityManagement.Migrations.IdentityDbConfiguration"__


## Performing Database Migrations and Data Seeding
1. Enable Migrations in JustBlog.Models
    - __Enable-Migrations -ContextTypeName "JustBlog.Models.JustBlogContext" -ProjectName "JustBlog.Models"__
2. Add Migration
    - __Add-Migration -ConfigurationTypeName "JustBlog.Models.Migrations.JustBlogDbConfiguration" -Name {name of update} -ProjectName "JustBlog.Models"__
3. Update Database
    - __Update-Database -ProjectName "JustBlog.Models" -ConfigurationTypeName "JustBlog.Models.Migrations.JustBlogDbConfiguration"__

# EF Core 2.X Migrations
1. Applies to __JustBlog__ as well is __Asp.Net Core Identity Framework__ (Authorization and Authentication)
    - __"JustBlogContext"__ or __"AppIdentityDbContext"__ for db context
    - __dotnet ef migrations  add _UserDefinedMigrationName_ --context _DbContext___
    - __dotnet ef database update --context _DbContext___
    - __dotnet ef database update --context _DbContext___
3. Remove database if needed
    - __dotnet ef database drop --context <DbContext>__


# Features to be Implemented
- Fix deep linking for Angular URLs
- Remove legacy model binders
- Clean up test server integration code
- Clean up dependency injection
- If possible move identity manage to backend service class
- Move to Microsoft's new dependency injection service
- Remove Ninject dependency injection service
- Migrate to .Net Core
- Migrate to Angular 2
- Remove Bower package manager

# Front-End Technology Stack
Following technologies are used in the front end technology stack...

## Gulp
Front end build system for managing TypeScript compilation and jasmine unit tests...

## Angular 1.x
Front end framework for creating modern SPA applications. Eventually this project will be upgraded to
Angular 2 (maybe Angular 4) to solve the following deficiencies in Angular from Angular 1.x -

### Route Handling
Angular route handling is sufficient but leaves a few things to be desired. First, guarding routes is difficult,
you have to create your own security mechanism that interacts with your authorization. Second
knowing when to load which data based on your routing is also challenging. This requires 
knowing string comparisons which are ugly. This is fixed in Angular 2.

### Two Way Model binding
Although the two way model bind in angular is sufficient, sometimes you don't want the full
two way model binding, one way is plenty sufficient. 

## Jasmine
Coming soon...

## Karma
Coming soon...

## Chutzpah
Coming soon...

## Protractor
Coming soon...

## NPM
Coming soon...

## Bower
Coming soon...

## DISQUIS
Coming soon...

# Backend Technology Stack
Following technologies are used in the backend technology stack -

## Web Api
Coming soon...


## JWT Authentication
The JWT authentication implemented in this solution is somewhat of a poor mans authentication
protocol. It should probably not be used in a production app. In a real JWT token
situation, what is desirable is to separate your auth server and token generation
from the front end application. In a real world application, this is what one would want to do.

## Test Server
Coming soon ...

## Entity Framework Paging
Coming soon...