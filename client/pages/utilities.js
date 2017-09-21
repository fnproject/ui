// Assorted utility functions

export function truncate(string,length){
   if (string.length > length)
      return string.substring(0,length)+'...';
   else
      return string;
};