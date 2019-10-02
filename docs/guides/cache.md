# Rules Cache

We handle _rules_ cache  __with [@feathers-plus/cache](https://github.com/feathers-plus/cache) to check user ability

When the client makes a request to the server we identify the user by JWT and get user data from the server, The rules are caching in the server and in this way we can check user abilities  
  
You can disabled the cache from config file &gt; ruleCache

  
  


