$(document).ready(function() {

var APPID = "&APPID=e06058fa10ba1670a8e02cd99396feba";

    //input of the user
    $("#city-search").submit(function(event){
        event.preventDefault();
        var city = $("#city").val();
        console.log("submited");

        var cityListItem = $("<li class='list-group-item'>"+city+"</li>").on('click', function(){
            var cityClick  =  $(this).text();
            console.log(cityClick); 
            getWeather(cityClick);     
        });
        $("#search-history").append(cityListItem);
         getWeather(city);
    });


function getWeather(city){
    
   

    if(city != ''){

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + APPID,
            type: "GET",
            dataType: "json",
            success: function(data){
                $(".temp").text(data.main.temp);
                $(".humidity").text(data.main.humidity);
                $(".wind").text(data.wind.speed);
                $("#current-icon").attr("src","http://openweathermap.org/img/wn/"+ data.weather[0].icon + "@2x.png")
                console.log(data);
                getUV(data.coord.lat, data.coord.lon);

               


                get5DayUV(data.coord.lat, data.coord.lon, city);
                


                
            
            
         }


    });
    }
}

        function getUV(lat,lon){
            console.log("http://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon="+lon + APPID);
        
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon="+lon + APPID,
                type: "GET",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    $(".UV").text(data.value);
            
                }

        })
    }


    function get5DayUV(lat,lon, city){
         console.log("http://api.openweathermap.org/data/2.5/uvi/forecast?lat="+ lat + "&cnt=5"+ "&lon="+lon + APPID);
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat="+ lat + "&cnt=4"+ "&lon="+lon + APPID,
            type: "GET",
            dataType: "json",
            success: function(uvData){
                console.log(uvData);
                get5Dayforcast(city, uvData);
        
            }

    })
}





// one for the current weather and for the 5 day forcast loop trough the results
        function get5Dayforcast(city, uvData){
            console.log("http://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=imperial" + APPID);


         $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=imperial" + APPID,
             type: "GET",
            dataType: "json",
            success: function(data){
                console.log(data);
                var j = 0;
                $(".card-deck").empty();

            for (let i = 0; i < data.list.length; i++) {

                 const day = data.list[i];
            if (day.dt_txt.indexOf("18:00:00")!== -1){
                
                var dayUv = uvData[j];
                j++;    
                var dateObj =  new Date(day.dt_txt);
                var dayString = dateObj.toLocaleDateString(); 
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var h5 = $("<h5>").addClass("card-title").text(dayString);
                var uvP = $("<p>").addClass("card-text").text(dayUv.value);
                var tempP = $("<p>").addClass("card-text").text(day.main.temp);
                
                cardBody.append(h5, uvP, tempP);
                card.append(cardBody);
                $(".card-deck").append(card);
                }

            }
                

            }
         })
    }
});