jQuery.noConflict();
jQuery('document').ready(function () {

    
        jQuery('#loading').popup('open');
        navigator.geolocation.getCurrentPosition(function(loc){
            var location = {
                lat : loc.coords.latitude,
                long : loc.coords.longitude,
                acc : loc.coords.accuracy
            }
            localStorage.setItem('location', JSON.stringify(location));
            jQuery('#loading').popup('close');
            jQuery(':mobile-pagecontainer').pagecontainer('change', '#p2', {
                transition: 'flip',
                changeHash: false,
                reverse: true,
                showLoadMsg: true
            });
            

            
        });
    
        jQuery('#p2').on('pageshow', function () {
            getArticles();
        });

        
});

var getArticles = function(){
    var location = JSON.parse(localStorage.getItem('location'));

    var articlesURL = "http://data.test.bbc.co.uk/v1/bbcrd-newslabs/creative-works?point="+location.lat+","+location.long+"&radius=15km&limit=5&apikey=YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";
    var articles;
    jQuery.ajax({ 
        url: articlesURL,
        success: function(data) {
            data["@graph"].forEach(function(element, index){
                var img;
                image(element['thumbnail'],{
                    success : function () { img = element['thumbnail']; },
                    failure : function () { img = 'http://www.smigroup.it/smi/repository_new/img/smi/image_not_found.jpg'}
                });
                img = (typeof img == "undefined")? "http://www.smigroup.it/smi/repository_new/img/smi/image_not_found.jpg" : img;
                var p = jQuery("<p class='article-title' ><a href='#' target='_blank' class='article-link'><span>" + element['title'] + "</span><img src='" + img + "' /></a></p>")
                p.data(element);
                jQuery('#p2 [data-role="content"]').append(p);
                p.on('click', function(e){
                    e.preventDefault();
                    console.log('running');
                    var element = jQuery(this).data();
                    var time = new Date(element.dateCreated);
                    var hashids = new Hashids(element.title);
                    var id = hashids.encode(+time);
                    jQuery(':mobile-pagecontainer').pagecontainer('change', '#p3', {
                        transition: 'flip',
                        changeHash: false,
                        reverse: true,
                        showLoadMsg: true
                    });
                    jQuery('#p3 #title').text(element.title);
                });
            });
        }
    })
}

// setTimeout(function () {
//     jQuery(':mobile-pagecontainer').pagecontainer('change', '#p2', {
//         transition: 'flip',
//         changeHash: false,
//         reverse: true,
//         showLoadMsg: true
//     });
// }, 1000);