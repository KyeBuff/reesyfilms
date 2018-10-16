$(document).ready(function(){

// cache contact ul
	var $contactList = $('ul.contact-list');

//cache nav ul parent and its height, nav items, all anchors with smooth scroll class, find all parts of page which will be targeted by scrollspy
	var lastId, topMenu = $("#exCollapsingNavbar2"),
    topMenuHeight = topMenu.outerHeight() + 150,
    menuItems = topMenu.find("ul li a"),
    scrollLinks = $('a.smooth-scroll'),
    scrollItems = menuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });

//Hide els on page load
	$contactList.hide(); 
	$('a.contact-details').hide();

	function toggleContacts() {
		$contactList.fadeToggle(500);
	}

//Get Instagramposts from user
	function getInstagramPosts() {
		var accessToken = '3065587934.b8276eb.b00efa13c3ef4e558d9cb115ca0d97c2';
		var userID = '3065587934';
		var numPhotos = 12;
		var instaConfig = {
			async: true,
			url: 'https://api.instagram.com/v1/users/' + userID + '/media/recent',
			dataType: 'jsonp',
			type: 'GET',
			data: {access_token: accessToken, count: numPhotos},
			success: function(data){
		 		// Create parent div variable
		 		var instagramImagesContent = '<div class = "row overlap-fix bg-dark-gray">'; 
				for(x in data.data){
					//if the image isn't the same in height and width do not append as impacts site layout
					if(data.data[x].images.standard_resolution.height === data.data[x].images.standard_resolution.width) {
						instagramImagesContent += '<div class="col-xs-sm-6 col-md-4 col-lg-3 p-a-0 img-opaque">'
						instagramImagesContent += '<a href="'+data.data[x].link+'" target="_blank">';
						instagramImagesContent += '<img class="img-fluid instagram-img" src="'+data.data[x].images.standard_resolution.url+'"'; //add alt tags where caption has a value 
						if(data.data[x].caption !== null) {
							instagramImagesContent += 'alt="'+data.data[x].caption.text+'">';
						} else {
							instagramImagesContent += 'reesyfilms instagram image';
						}
						instagramImagesContent += '</a>';
						instagramImagesContent += '</div>';
					}				
				}
				instagramImagesContent += '</div>';

				$('#instagram-images').append(instagramImagesContent);
			},
			error: function(data){
				var errorMsg = '<p class="error text-xs-center">Oops!<br> <span class="error-desc roboto">We are unable to retrieve data from Instagram, please refresh the page.</span></p>';
				$('#instagram-images').append(errorMsg);
			}
		}
		$.ajax(instaConfig);
	}

// smooth scroll
	scrollLinks.on('click', function(e) {
		//initiate offset
		var offset;
		//cache href
	    var href = $(this).attr("href"),
	    //adjust topMenuHeight
	    	topMenuHeight = topMenu.outerHeight() + 20,
	    	//if href = '#' then offset top === 0 else scroll to targeted el
	        offsetTop = href === "#" ? 0 : $(href).offset().top;

	    //adjust offset dependant on window size
	    if(href === '#about' && window.innerWidth < 992) {
	    	offset = 50;
	    } else if(window.innerWidth >= 992) {
	    	offset = 50;
	    } else {
	    	offset = 75;
	    }

	    $('html, body').stop().animate({
	        scrollTop: offsetTop - offset
	    }, 300);
	    e.preventDefault();

		if(window.innerWidth <= 991 && this.id !== 'to-top-btn') { //Prevents nav opening when clicking to top button
			$('#hamburger').click();
		}  
		  
	});
// scrollspy
	$(window).on('scroll', function() {
		//cache windows scrollTop
	    var fromTop = $(this).scrollTop() + topMenuHeight;
	    var $logo = $('#logo');
	    var cur = scrollItems.map(function() {
	        if ($(this).offset().top < fromTop) return this;
	    });

	    cur = cur[cur.length - 1];
	    var id = cur && cur.length ? cur[0].id : "";

	    if (lastId !== id) {
	        lastId = id;
	        menuItems.parent().removeClass("active").end().filter('[href="#' + id + '"]').parent().addClass("active");
	    }
	    //Fades contact list on scroll in mobile/ipad
		$('a.contact-details').hide();	
		$contactList.fadeOut(500);

		if(document.documentElement.scrollTop > 0 || window.scrollY > 0) {
			$logo.slideUp(250);
		} else {
			$logo.slideDown(250);
		}
    
	});

	$('a.contact-reesy').on('click', function(e) {
		e.preventDefault();
		toggleContacts();

		if(this.id === 'nav-contact' && window.innerWidth < 992) {
			$('#hamburger').click();
		}
	});

	$('a.contact-link').on('click', function(e) {
		e.preventDefault();
		$('a.contact-details').slideToggle(500);
	});	

	getInstagramPosts();

});

