// Assorted utility functions

export function truncate(string,length){
   if (string.length > length)
      return string.substring(0,length)+'...';
   else
      return string;
};

// return whether any of the specified routes has the specified path
// thisPath - string
// routes - an array of route objects
export function isPathIn(path,routes){
  var result = false; 
  for (var k= 0; k < routes.length; k++){
       if (path==routes[k].path){
       return true;
      }
  }
};
