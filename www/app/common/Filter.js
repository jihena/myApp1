appContext.filter("timeStamp2Date",function(){
  return function(input){
    try {
      return new Date(parseInt(input));
    } catch (e) {
      return input;
    } finally {
      return input;
    }

  }
});
