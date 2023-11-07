module.exports = {
  tempo: function () {
    var data = new Date();
    var day, Month, Hours, Minutes,aaaa,all;
    day = data.getDate() + "/";
    Month = data.getMonth() + 1 + "/";
    Hours = data.getHours() + ":";
    Minutes = data.getMinutes() + " ";
    aaaa = data.getFullYear();
    all =  Hours+ Minutes+ day  + Month + aaaa;
    return all;
  },
  tagDescription: function (arrayKeys, arrayTagDescription, tableProperties) {
        for(let j = 0; j < arrayTagDescription.length; j++){
        // controllo se la chiave nell'array ha il suo corrispsettivo nella tabella tag
        if(arrayTagDescription[j].tag === arrayKeys) 
        {
          tableProperties ["tag"] = arrayTagDescription[j].tag;
          tableProperties ["description"] = arrayTagDescription[j].description;
          break; 
        }
        else
        {
          tableProperties ["tag"] = arrayKeys;
          tableProperties ["description"] = "nessuna";
        }
      }
      return ;
  },
  sistemException: function (obj0,obj1,fromSistem){
      console.log(obj0);
      console.log(obj1);
      if(fromSistem==="MUREX")
      {
        var  Murex_value = obj0;
        var  Bank_value = obj1;
      }
      if(fromSistem!=="MUREX")
      {
        var  Murex_value = obj1;
        var  Bank_value = obj0;
      }
      if(obj0 === obj1){
         var exception = 1;
      }
      else
      {
          exception = 0;
      }
    return [exception,Murex_value,Bank_value]
  }      
    //   switch (true) {

    //   case fromSistem === "MUREX":
    //     console.log("sto nel murex");
    //     var Murex_value = obj0;
    //     var Bank_value = obj1;  
    //   case fromSistem !== "MUREX":
    //     console.log("sto nel non M");
    //     var Murex_value = obj1;
    //     var Bank_value = obj0;
  
    //   case obj0 == obj1:
    //    console.log("sto nel caso 1");
    //     var exception = 1;
    //   case obj0 != obj1:
    //     console.log("sto nel caso 0");
    //     var exception = 0; 
    // }

};