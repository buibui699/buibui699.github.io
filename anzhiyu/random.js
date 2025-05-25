var posts=["2025/05/25/阅读笔记2/","2025/05/25/诗词1/","2025/05/14/hello-world/","2025/05/11/阅读笔记1/","2025/05/10/我的第一篇文章/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };