using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using Microsoft.AspNetCore.NodeServices.Npm;
using Microsoft.AspNetCore.NodeServices.Util;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Logging;
namespace vdn
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
             services.AddNodeServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory factory)
        {
            factory.AddConsole();
            var npmScriptRunner = new NpmScriptRunner(
                "ClientApp", "init", null, new ConcurrentDictionary<string, string>());

            npmScriptRunner.AttachToLogger(factory.CreateLogger("npm"));

            var cont = true;
            npmScriptRunner.StdErr.OnStreamClosed += () =>
            {
                cont = false;
                Debug.Print("StdErr.OnStreamClosed");
            };
            npmScriptRunner.StdErr.OnReceivedChunk += chunk =>
            {

                Debug.Print("StdErr.OnReceivedChunk");
            };
            npmScriptRunner.StdErr.OnReceivedLine += line =>
            {

                Debug.Print("StdErr.OnReceivedLine");
            };

            npmScriptRunner.StdOut.OnStreamClosed += () =>
            {

                Debug.Print("StdErr.OnStreamClosed");
            };
            npmScriptRunner.StdOut.OnReceivedChunk += chunk =>
            {

                Debug.Print("StdErr.OnReceivedChunk");
            };
            npmScriptRunner.StdOut.OnReceivedLine += line =>
            {
                cont = false;

                Debug.Print("StdErr.OnReceivedLine");
            };
            while (cont)
            {
                Thread.Sleep(3000);
            }

            if (env.IsDevelopment())
            {   
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware( new WebpackDevMiddlewareOptions {
                    ProjectPath = "ClientApp",
                    HotModuleReplacement = true,
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index"});
                
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
