define([], function (){
  
  return {
    read: function (key, deleteAfter){
      var cookies = document.cookie.split('; ');
      for (var i = 0, li = cookies.length; i < li; i++){
        var cookie = cookies[i].split('=');
        if (cookie[0] === key){
          var val = decodeURIComponent(cookie[1]);
          if (deleteAfter){
            this.erase(key);
          }
          return val;
        }
      }
      return null;
    },

    erase: function (key){
      var date = new Date();
      date.setDate(date.getDate() - 1);
      document.cookie = key + '=;expires=' + date.toGMTString();
    },

    write: function (key, value){
      var date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      document.cookie = key + '=' + escape(value) + ';expires=' + date.toGMTString() + ';path=/';
    }
  }
});