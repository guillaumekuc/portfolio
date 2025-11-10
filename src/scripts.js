import $ from 'jquery';
import 'slick-carousel';

// Make jQuery available globally for slick-carousel
window.$ = window.jQuery = $;

// Variables in module scope - will be initialized by initScripts()
var bgMusicElement;
var splashscreenVolumeSlider;
var footerVolumeSlider;
var splashscreenMuteBtn;
var footerMuteBtn;
var footerPlayBtn;
var footerSleekSlider;
var footerLoopBtn;
var currentTimeDisplay;
var durationDisplay;
var musicPlaylist;
var bgVolume;
var bgMusicIsPlaying = false;
var bgMusicIsLooping;
var bgMusicIsMuted = false;
var musicArray;
var musicCurrentIndex = 0;
var menuSelected = 1;
var websitesArray;
var websitesCurrentIndex = 0;
var unpauseMusicWhenDone;

// Initialize script variables after DOM is ready
export function initScripts() {
  bgMusicElement = document.querySelector("#bgMusic");
  splashscreenVolumeSlider = document.querySelector('#bgVolume');
  footerVolumeSlider = document.querySelector('#footerVolumeSlider');
  splashscreenMuteBtn = document.querySelector('#muteBgMusic');
  footerMuteBtn = document.querySelector('#footerMuteBtn');
  footerPlayBtn = document.querySelector('#footerPlayBtn');
  footerSleekSlider = document.querySelector('#footerSleekSlider');
  footerLoopBtn = document.querySelector('#footerLoopBtn');
  currentTimeDisplay = document.querySelector('#currentTime');
  durationDisplay = document.querySelector('#duration');
  musicPlaylist = document.querySelectorAll('#musicPlaylist li');
  musicArray = Array.prototype.slice.call(document.querySelector('#musicPlaylist').children);
  websitesArray = Array.prototype.slice.call(document.querySelectorAll('.websiteLink'));
}

// Loading screen handled in main.js
function initLoadingScreen() {
  document.onreadystatechange = function()
  {
    var state = document.readyState;
    if (state == 'interactive') 
    {
    	// do nothing
    } 
    else if (state == 'complete') 
    {
  		document.getElementById('load').classList.toggle('active');
      document.getElementById('load').style.opacity= 0;

      setTimeout(function(){document.getElementById('load').style.visibility="hidden";
      }, 1000);
    }
  }
}

function slickCarousel() {
	// Initialize slick on all galleries
	// Use setTimeout to ensure DOM is fully rendered and jQuery is available
	setTimeout(function() {
		const galleries = document.querySelectorAll('.gallery');
		if (galleries.length > 0 && typeof $ !== 'undefined' && $.fn.slick) {
			$('.gallery').each(function() {
				// Only initialize if not already initialized
				if (!$(this).hasClass('slick-initialized')) {
					$(this).slick({
						dots: false,
						infinite: true,
						speed: 300,
						slidesToShow: 1,
						centerMode: true,
						variableWidth: true,
						arrows: true,
						focusOnSelect: true,
						autoplay: false,
						centerPadding: '0px',
						draggable: true,
						touchThreshold: 100,
					});
				}
			});
		} else {
			console.warn('Slick carousel not available or galleries not found');
		}
	}, 200);
}

function bgMusicControls() {

	function timeFormat(s) {
	    var m = Math.floor(s / 60);
	    s = Math.floor(s % 60);
	    s = (s >= 10) ? s : "0" + s;
	    return m + ":" + s;
	}
		
	function stop() {
		bgMusicElement.pause();
		bgMusicElement.currentTime = 0;
		bgMusicIsPlaying = false;
		splashscreenMuteBtn.classList.remove('isPlaying');
		splashscreenMuteBtn.classList.add('isNotPlaying');
	} //stop()

	function play() {
		bgMusicElement.play();
		bgMusicIsPlaying = true;	
		footerPlayBtn.classList.add('isPlaying');
	} //play()

	function pause() {
		bgMusicElement.pause();
		bgMusicIsPlaying = false;
		footerPlayBtn.classList.remove('isPlaying');
	} //pause()	

	function playHandler() {

		if (bgMusicIsPlaying==false){
			play();
		} else if (bgMusicIsPlaying==true) {
			pause();
		}
	} //playHandler()

	function muteHandler() {	

		function mute() {
			bgMusicElement.volume = 0;
			document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=0;});
			bgVolume = splashscreenVolumeSlider.value;
			splashscreenVolumeSlider.value = 0;
			footerVolumeSlider.value = 0;
			bgMusicIsMuted=true;
			splashscreenMuteBtn.classList.add('isMuted');
			footerMuteBtn.classList.add('isMuted');

		} //mute()

		function unmute() {
			
			if (bgVolume == undefined || bgVolume==0)
			{
				bgMusicElement.volume = 1;
				document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=1;});
				bgVolume = 100;
				splashscreenVolumeSlider.value = bgVolume;
				footerVolumeSlider.value = splashscreenVolumeSlider.value;
			} else {
				bgMusicElement.volume = bgVolume/100;
				document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=bgVolume/100;});
				splashscreenVolumeSlider.value = bgVolume;
				footerVolumeSlider.value = splashscreenVolumeSlider.value;
			} // if else
			bgMusicIsMuted=false;
			splashscreenMuteBtn.classList.remove('isMuted');
			footerMuteBtn.classList.remove('isMuted');
		} //unmute()

		if (bgMusicIsMuted==false) {
			mute();
		} else {
			unmute();
		} //if else
	} // muteHandler()

	function volumeHandler() {
		if (this==splashscreenVolumeSlider){
			bgVolume = splashscreenVolumeSlider.value;
			footerVolumeSlider.value=splashscreenVolumeSlider.value;

		}
		if (this==footerVolumeSlider){
			bgVolume = footerVolumeSlider.value;
			splashscreenVolumeSlider.value=footerVolumeSlider.value;
		}
		bgMusicElement.volume = bgVolume/100;
		document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=bgVolume/100;});
		
		if (bgVolume == 0){
			splashscreenMuteBtn.classList.add('isMuted');
			footerMuteBtn.classList.add('isMuted');
			bgMusicIsMuted = true;
		} else {
			splashscreenMuteBtn.classList.remove('isMuted');
			footerMuteBtn.classList.remove('isMuted');
			bgMusicIsMuted = false;
		}
	} //volumeHandler()

	function updateTime(){
		var currentTime = bgMusicElement.currentTime;
    	var duration = bgMusicElement.duration;
    	
    	if (duration) {
    		footerSleekSlider.value = currentTime / duration *100;
    		durationDisplay.textContent = timeFormat(duration);	
    	} else {
    		durationDisplay.textContent = '0.00';
    		footerSleekSlider.value = 0;
    	}
    	currentTimeDisplay.textContent = timeFormat(currentTime);
    	

    	if (currentTime==duration & bgMusicIsLooping==false){
    		if (musicCurrentIndex + 1 < musicArray.length){
	    		musicCurrentIndex = musicCurrentIndex+1;
				checkFirstAndLastTrack();
				document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
				musicArray[musicCurrentIndex].classList.add('focus');
				bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
				setTimeout(play(),500);
				updateTrackImage();
			} else {
				pause();
				bgMusicElement.currentTime=0;
			}
    	}
	} //timeUpdateHandler()

	function sleekHandler(){
		bgMusicElement.currentTime = footerSleekSlider.value / 100 * bgMusicElement.duration;

	}//sleekHandler()

	function loopHandler(){
		if (bgMusicElement.loop==true){
			bgMusicElement.loop=false;
			footerLoopBtn.classList.remove('isLooping');
			bgMusicIsLooping=false;
		} else if (bgMusicElement.loop==false){
			bgMusicElement.loop=true;
			footerLoopBtn.classList.add('isLooping');
			bgMusicIsLooping=true;
		}
	}

	function checkFirstAndLastTrack (){
		if (musicCurrentIndex+1==musicArray.length){
			footerNextBtn.classList.add('lastTrack');
		} else {
			footerNextBtn.classList.remove('lastTrack');
		}
		if (musicCurrentIndex==0){
			footerPreviousBtn.classList.add('firstTrack');
		} else {
			footerPreviousBtn.classList.remove('firstTrack');
		}
	}

	function updateTrackImage(){
		document.querySelector('#musicPlaylistCover').style.background= "no-repeat center / cover url("+musicArray[musicCurrentIndex].getAttribute('data-image')+")";
	}

	function nextTrackHandler(){
		
		if (musicCurrentIndex+1 < musicArray.length){
			musicCurrentIndex = musicCurrentIndex+1;
			checkFirstAndLastTrack();
			document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
			musicArray[musicCurrentIndex].classList.add('focus');
			bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
			play();
			updateTrackImage();
		}
	}

	function previousTrackHandler(){
		if (musicCurrentIndex>0){
			musicCurrentIndex = musicCurrentIndex-1;
			checkFirstAndLastTrack();
			document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
			musicArray[musicCurrentIndex].classList.add('focus');
			bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
			play();
			updateTrackImage();
		}

	}


	function trackClicked() {
		newMusic = this.getAttribute('data-sound');
		bgMusicElement.setAttribute('src', newMusic);
		play();
		document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
		this.classList.add('focus');
		musicCurrentIndex=musicArray.indexOf(this);
		checkFirstAndLastTrack();
		updateTrackImage();


	}

	splashscreenMuteBtn.addEventListener('click', muteHandler);
	footerMuteBtn.addEventListener('click', muteHandler);
	splashscreenVolumeSlider.addEventListener('input', volumeHandler);
	footerVolumeSlider.addEventListener('input', volumeHandler);
	footerPlayBtn.addEventListener('click', playHandler);
	bgMusicElement.addEventListener('timeupdate', updateTime);
	footerSleekSlider.addEventListener('input', sleekHandler);
	footerLoopBtn.addEventListener('click', loopHandler);
	footerNextBtn.addEventListener('click', nextTrackHandler);
	footerPreviousBtn.addEventListener('click', previousTrackHandler);
	musicPlaylist.forEach(function (track) {track.addEventListener('click', trackClicked)})
	//footerPreviousBtn.addEventListener('click', previousTrackHandler);
} // musicPlayer()

function navigation() {
	var enterBtn = document.querySelector('#enterBtn');
	var allRubrics = document.querySelectorAll('.rubric');
	var currentScreen = 'startScreen';
	var rubricFocused = 3;
	var rubricClass;
				
	function updateRubricClass() {
		if (rubricFocused==1){ rubricClass= "folio3D"; }
		if (rubricFocused==2){ rubricClass= "folio2D"; }
		if (rubricFocused==3){	rubricClass= "folioAll"; }
		if (rubricFocused==4){	rubricClass= "folioMusic"; }
		if (rubricFocused==5){	rubricClass= "folioWeb"; }
	} //updateRubricClass

	function initializeScroll() {
		document.body.scroll(0,0);
		//location.hash="splashscreen";
	} //initializeScroll()

	function reSnap() {
	//scroll by one pixel to force a resnap when the window is resized
		
		setTimeout(()=>{document.body.scrollTop +=1; document.body.scrollTop -=1;},500);
	} //resnap()

	function cartography() {
	//function to keep track of where we are in the website scroll-wise.
			
		var allFullPages = document.querySelectorAll(".fullPage");

		function updateHashWhenVisible(element) {
			var elementObserver = new IntersectionObserver(function(entries) {
				// isIntersecting is true when element and viewport are overlapping
				// isIntersecting is false when element and viewport don't overlap
				if(entries[0].isIntersecting === true){
					//location.hash=element.id;
					currentScreen=element.id;
					// Refresh slick position when screen becomes visible
					if (typeof $ !== 'undefined' && $.fn.slick) {
						$('.gallery').slick('setPosition');
					}
					if (document.querySelector('#'+currentScreen+' '+'.gallery')){
						document.querySelector('#'+currentScreen+' '+'.gallery').firstChild.focus();
						if (document.querySelector('.slick-current video')){
							document.querySelector('.slick-current video').play();
						}						
					}
					if (currentScreen=="splashscreen" || currentScreen=="startScreen")
					{
						document.querySelector('#topArrow').classList.add('hidden');
						document.querySelector('#bottomArrow').classList.add('hidden');
					}
					if (currentScreen=="about")
					{
						document.querySelector('#bottomArrow').classList.add('hidden');
					}

					if (currentScreen=="websitesFolio"){
						document.querySelectorAll('.websiteLink').forEach(function(link) {link.classList.remove('focus');});				
						websitesArray[websitesCurrentIndex].classList.add('focus');
					}
				}

			}, { threshold: [0.5] });

			elementObserver.observe(element);
		} //whenVisible

		function videoObserver(video) {
			var videoObserver = new IntersectionObserver(function(entries){ 
  				var entry=entries[0];
    				if(entry.intersectionRatio!=1 && !video.paused){
			      		video.pause();
			      		video.parentElement.querySelector('.videoPlayBtn').classList.remove('hidden');
			    		if (unpauseMusicWhenDone==true)
			    		{
			    			bgMusicElement.play();
			    			bgMusicIsPlaying =true;
			    			footerPlayBtn.classList.add('isPlaying');
			    		}

			    	}
			}, {threshold: 1});
			videoObserver.observe(video.parentElement);
		}//videoObserver

		function revealFoliosWhenRubricsVisible() {
			var elementObserver = new IntersectionObserver(function(entries) {
				if(entries[0].isIntersecting===true){
					updateRubricClass();
					setTimeout(()=>{document.querySelectorAll('.'+ rubricClass).forEach(function(folio){folio.classList.remove('hidden');});},500);
				}
			}, { threshold: [0.5] });

			elementObserver.observe(document.querySelector('#rubrics'));
		}//revealFoliosWhenRubricsVisible

		function hideFoliosWhenSplashscreenVisible() {
			var elementObserver = new IntersectionObserver(function(entries) {
				if(entries[0].isIntersecting===true){
					setTimeout(()=>{
						document.querySelectorAll('.folio').forEach(function(folio){
							folio.classList.add('hidden');
						});
					},500);
				}
			}, { treshold : [0.5]});

			elementObserver.observe(document.querySelector('#splashscreen'));
		}//hideFoliosWhenSplashscreenVisible

		revealFoliosWhenRubricsVisible();
		hideFoliosWhenSplashscreenVisible();
		document.querySelectorAll(".fullPage").forEach(function(page){ updateHashWhenVisible(page);});
		document.querySelectorAll(".largeVideo").forEach(function(video){videoObserver(video);});
	} //cartography()

	function getIn(){
		function launchbgMusicElement() {
			bgMusicElement.play();
			bgMusicIsPlaying = true;
			splashscreenMuteBtn.classList.remove('isMuted');
			footerMuteBtn.classList.remove('isMuted');
			footerPlayBtn.classList.add('isPlaying');
			if (bgVolume == undefined || bgVolume == 0)
			{
				bgMusicElement.volume = 1;
				bgVolume = 100;
				splashscreenVolumeSlider.value = bgVolume;
				footerVolumeSlider.value = bgVolume;
			} else {
				bgMusicElement.volume = bgVolume/100;
				splashscreenVolumeSlider.value = bgVolume;
				footerVolumeSlider.value = bgVolume;
			} // if else
			
			if (bgMusicElement.loop==true){
				footerLoopBtn.classList.add('isLooping');
			} else if (bgMusicElement.loop==false){
				footerLoopBtn.classList.remove('isLooping');
			}

			document.querySelector('#musicPlaylistCover').style.background= "no-repeat center / cover url("+musicArray[0].getAttribute('data-image')+")";
		} //launchbgMusicElement()

		function animateOpening() {
			var startScreen = document.querySelector('#startScreen');
			var art = document.querySelector('#splashArt');
			var title = document.querySelector('#splashTitle');
			var subtitle = document.querySelector('#splashSubTitle');
			var oneLiner = document.querySelector('#splashDescription');
			var domains = document.querySelector('#splashDomains');
			var splashNav = document.querySelector('#splashNav');
			var splashLinks = document.querySelectorAll('.splashLinks a');
			var splashNavLinks = document.querySelectorAll('.splashNav a');
			startScreen.classList.add('fadeOut');
			art.style.transform="scale(1)";
			title.style.opacity = "100%";
			subtitle.style.opacity="100%";
			oneLiner.style.opacity="100%";
			domains.style.opacity="100%";
			splashNav.style.opacity="100%";
			var n = 0;
			var animStartTime=3;
			while (n < splashLinks.length) {
				splashLinks[n].style.transition = "opacity 1s ease-out "+animStartTime+"s";
				n = n+1;
				animStartTime=animStartTime+0.25;
			}
			splashLinks.forEach(link => {link.style.opacity="100%";} 	);
			splashNavLinks.forEach(link => {link.style.opacity="100%"; setTimeout(()=> {link.style.pointerEvents="auto"; }, 4000); } );
		} //animateOpening

		function displayScrollBar(){

			document.body.style.overflow = 'auto';
		} //displayScrollBar

		function hideAllFolios(){

			document.querySelectorAll('.folio').forEach(function(folio){ folio.classList.add('hidden');});
		}
		
		initializeScroll();
		hideAllFolios();
		cartography();
		animateOpening();
		displayScrollBar();
		launchbgMusicElement();
	} // getIn()

	function goToFolios() {
		var nextVisibleFolio;
		var nextFolio=document.querySelector('#'+currentScreen).nextElementSibling;
		while (nextFolio) {
				if (nextFolio.classList.contains('hidden')==false) {
			nextVisibleFolio = nextFolio;
			break;
				}//if
				nextFolio = nextFolio.nextElementSibling;
			}//while
		if (nextVisibleFolio){
			nextVisibleFolio.scrollIntoView();
		}//if
	}

	function hideIrrelevantFolios() {
		updateRubricClass();
			
	    document.querySelectorAll('.folio').forEach(function(folio) {folio.classList.add('hidden');});
	    document.querySelectorAll('.'+ rubricClass.toString()).forEach(function(folio) {folio.classList.remove('hidden');});
	}

	function nextVisibleSibling(element) {
		var nextVisibleElement;
		var nextElement=element.nextElementSibling;
		while (nextElement) {
				if (nextElement.classList.contains('hidden')==false) {
			nextVisibleElement = nextElement;
			break;
				}//if
				nextElement = nextElement.nextElementSibling;
			}//while
		return nextVisibleElement;
	}

	function previousVisibleSibling(element) {
		var previousVisibleElement;
		var previousElement=element.previousElementSibling;
		while (previousElement) {
				if (previousElement.classList.contains('hidden')==false) {
			previousVisibleElement = previousElement;
			break;
				}//if
				previousElement = previousElement.previousElementSibling;
			}//while
		return previousVisibleElement;
	}

	function keyNavigation(event){
	
    	function fakeHoverEvent(target){
    		target.style.transition='none';
    		target.classList.add('fakeHoverEvent');
    		setTimeout(() => {target.classList.remove('fakeHoverEvent');}, 100);
    	}//fakeHoverEvent()
		
		switch (event.key) {
		    case "ArrowLeft": event.preventDefault(); break;
		    case "ArrowRight": event.preventDefault(); break;
		    case "ArrowUp": event.preventDefault(); break;
		    case "ArrowDown": event.preventDefault(); break;
		    case " ": event.preventDefault(); break;
		    case "l": event.preventDefault(); break;
		    case "m": event.preventDefault(); break;
		    case "z": event.preventDefault(); break;
		    case "s": event.preventDefault(); break;
		    case "d": event.preventDefault(); break;
		    case "q": event.preventDefault(); break;
		    case "Enter": event.preventDefault(); break;
		} //switch prevent default

		if (event.key=="q"){
			//previoustrack
			if (musicCurrentIndex>0){
				musicCurrentIndex = musicCurrentIndex-1;
			//checkFirstAndLastTrack();
				if (musicCurrentIndex+1==musicArray.length){
						footerNextBtn.classList.add('lastTrack');
					} else {
						footerNextBtn.classList.remove('lastTrack');
					}
					if (musicCurrentIndex==0){
						footerPreviousBtn.classList.add('firstTrack');
					} else {
						footerPreviousBtn.classList.remove('firstTrack');
					}
			//Checkfirstandlasttrack ends
			document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
			musicArray[musicCurrentIndex].classList.add('focus');
			bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
			
			//play
			bgMusicElement.play();
				bgMusicIsPlaying = true;	
				footerPlayBtn.classList.add('isPlaying');
			//play ends
			//updateTrackImage();
			document.querySelector('#musicPlaylistCover').style.background= "no-repeat center / cover url("+musicArray[musicCurrentIndex].getAttribute('data-image')+")";
			//updateTrackImage ends
			}
		}
		if (event.key=="d"){
			if (musicCurrentIndex+1 < musicArray.length){
					musicCurrentIndex = musicCurrentIndex+1;

					//checkFirstAndLastTrack();
					if (musicCurrentIndex+1==musicArray.length){
							footerNextBtn.classList.add('lastTrack');
					} else {
							footerNextBtn.classList.remove('lastTrack');
					}
					if (musicCurrentIndex==0){
							footerPreviousBtn.classList.add('firstTrack');
					} else {
							footerPreviousBtn.classList.remove('firstTrack');
					}
					//Checkfirstandlasttrack ends

					document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
					musicArray[musicCurrentIndex].classList.add('focus');
					bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
				
					//play
					bgMusicElement.play();
					bgMusicIsPlaying = true;	
					footerPlayBtn.classList.add('isPlaying');
					//play ends

					//updateTrackImage();
					document.querySelector('#musicPlaylistCover').style.background= "no-repeat center / cover url("+musicArray[musicCurrentIndex].getAttribute('data-image')+")";
					//updateTrackImage ends
			}
		}
		
		if (event.key=="z"){
			bgVolume=parseInt(bgVolume);
			bgVolume +=10;
			splashscreenVolumeSlider.value= bgVolume;
			footerVolumeSlider.value = bgVolume;
			bgMusicElement.volume= bgVolume/100;

			//volumeUp
		}
		if (event.key=="s"){
			//volumeDown
			bgVolume=parseInt(bgVolume);
			bgVolume -=10;
			splashscreenVolumeSlider.value= bgVolume;
			footerVolumeSlider.value = bgVolume;
			bgMusicElement.volume= bgVolume/100;
		}
		
		if (currentScreen=="startScreen"){
			switch (event.key) {
				case "Enter": 
					fakeHoverEvent(document.querySelector('#enterBtn'));
					getIn(); 
					break;
			}
		}// startscreen

		if (currentScreen=="splashscreen"){
			
			if (event.key=="ArrowDown") {
				document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
				menuSelected=1;
		        fakeHoverEvent(document.querySelector('#worksBtn'));
		        
		        document.querySelector('#rubrics').scrollIntoView();
		        
			} //ArrowDown


			if (event.key=="ArrowLeft") {
				if (menuSelected==1){
					menuSelected=0;

					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#blogBtn').classList.add('focus');
				} else if (menuSelected==0){
					menuSelected=2;
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#contactBtn').classList.add('focus');
				} else if (menuSelected==2){
					menuSelected=1;
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#worksBtn').classList.add('focus');
				}      
			} //ArrowLeft

			if (event.key=="ArrowRight") {
				if (menuSelected==2){
					menuSelected=0;

					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#blogBtn').classList.add('focus');
				} else if (menuSelected==1){
					menuSelected=2;
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#contactBtn').classList.add('focus');
				} else if (menuSelected==0){
					menuSelected=1;
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					document.querySelector('#worksBtn').classList.add('focus');
				}      
			} //ArrowLeft

			if (event.key=="Enter") {
				if (menuSelected==0){
					window.open(document.querySelector('#blogBtn').getAttribute('href')).focus();
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
		
					menuSelected=1;

				} else if (menuSelected==1){
					document.querySelector('#rubrics').scrollIntoView();
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					menuSelected=1;
				} else if (menuSelected==2){
					javascript:window.open('mailto:guillaume@guillaumekuc.com', 'mail');
					document.querySelectorAll('.splashNav a').forEach(function(link) {link.classList.remove('focus');});
					menuSelected=1;
				}
			}

		}// splashscreen

		if (currentScreen=="rubrics"){

			if (event.key=="ArrowRight") {
				if (rubricFocused==5) { 
					rubricFocused=1;
				} else {
					rubricFocused= parseInt(rubricFocused) + 1;
				}
				var idToFocus= '#rBtn' + rubricFocused;
				allRubrics.forEach(rubric => rubric.classList.remove('focus'));
				document.querySelector(idToFocus).classList.add('focus');
				var target ='#hnBtn' + rubricFocused;
				document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
				document.querySelector(target).classList.add('focus');
				hideIrrelevantFolios();
			} // ArrowRight

			if (event.key=="ArrowLeft") {
				if (rubricFocused==1) { 
					rubricFocused=5;
				} else { 
					rubricFocused= parseInt(rubricFocused) - 1;
				}
				var idToFocus= '#rBtn' + rubricFocused;
				allRubrics.forEach(rubric => rubric.classList.remove('focus'));
				document.querySelector(idToFocus).classList.add('focus');
				var target ='#hnBtn' + rubricFocused;
				document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
				document.querySelector(target).classList.add('focus');
				hideIrrelevantFolios();
			}//ArrowLeft

			if (event.key=="ArrowUp") {	
				var isChrome = Boolean(window.chrome);
				if (isChrome) {
				//CHROME DOES NOT BEHAVE AS EXPECTED. THIS IS A HACK TO MAKE IT WORK. I HATE CHROME. 🖕.
					document.querySelector('#header').classList.add('hidden');
					document.querySelector('#footer').classList.add('hidden');
					document.querySelector('#splashscreen').scrollIntoView();
					setTimeout(()=>{
						document.querySelector('#header').classList.remove('hidden');
						document.querySelector('#footer').classList.remove('hidden');
					},500);
				} else {
					document.querySelector('#splashscreen').scrollIntoView();
				}

			}//ArrowUp

			if (event.key=="Enter") {
				goToFolios();
			} //Enter

			if (event.key=="ArrowDown") {
				goToFolios();	
			} //Enter
		}//rubrics

		if (currentScreen!==startScreen & currentScreen!==splashscreen & currentScreen!==rubrics){
			if (event.key=="ArrowUp") {
				if (previousVisibleSibling(document.querySelector('#'+currentScreen))){
					previousVisibleSibling(document.querySelector('#'+currentScreen)).scrollIntoView();
				}
			}
			if (event.key=="ArrowDown") {
				if (nextVisibleSibling(document.querySelector('#'+currentScreen))) {
					nextVisibleSibling(document.querySelector('#'+currentScreen)).scrollIntoView();
				}
			}

			if (document.querySelector('#'+currentScreen + ' .scrollThis')){
				if (event.key=="ArrowLeft"){
					document.querySelector('#'+currentScreen + ' .scrollThis').scrollTop -= 30;
				}
				if (event.key=="ArrowRight"){
					document.querySelector('#'+currentScreen + ' .scrollThis').scrollTop += 30;
				}
			}
			if (event.key==" ") {
				if (bgMusicIsPlaying==false){
					bgMusicElement.play();
					bgMusicIsPlaying = true;	
					footerPlayBtn.classList.add('isPlaying');
				} else if (bgMusicIsPlaying==true) {
					bgMusicElement.pause();
					bgMusicIsPlaying = false;
					footerPlayBtn.classList.remove('isPlaying');
				}				
			}
			if (event.key=="m"){
				if (bgMusicIsMuted){
					if (bgVolume == undefined || bgVolume==0)
					{
						bgMusicElement.volume = 1;
						document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=1;});
						bgVolume = 100;
						splashscreenVolumeSlider.value = bgVolume;
						footerVolumeSlider.value = splashscreenVolumeSlider.value;
					} else {
						bgMusicElement.volume = bgVolume/100;
						document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=bgVolume/100;});
						splashscreenVolumeSlider.value = bgVolume;
						footerVolumeSlider.value = splashscreenVolumeSlider.value;
					} // if else
					bgMusicIsMuted=false;
					splashscreenMuteBtn.classList.remove('isMuted');
					footerMuteBtn.classList.remove('isMuted');
				} else {
					bgMusicElement.volume = 0;
					document.querySelectorAll('.largeVideo').forEach(function(video){video.volume=0;});
					bgVolume = splashscreenVolumeSlider.value;
					splashscreenVolumeSlider.value = 0;
					footerVolumeSlider.value = 0;
					bgMusicIsMuted=true;
					splashscreenMuteBtn.classList.add('isMuted');
					footerMuteBtn.classList.add('isMuted');
				}
			}
			if (event.key=="l"){
				if (bgMusicElement.loop==true){
					bgMusicElement.loop=false;
					footerLoopBtn.classList.remove('isLooping');
					bgMusicIsLooping=false;
				} else if (bgMusicElement.loop==false){
					bgMusicElement.loop=true;
					footerLoopBtn.classList.add('isLooping');
					bgMusicIsLooping=true;
				}
			}
		}// otherscreens

		if (currentScreen=='musicPlaylistFolio'){
			function scrollIfNeeded(element, container) {
			 	element.scrollIntoView( {behavior: 'smooth',
   				block: 'nearest',
   				inline: 'start'});
			}

			function checkFirstAndLastTrack (){
				if (musicCurrentIndex+1==musicArray.length){
					footerNextBtn.classList.add('lastTrack');
				} else {
					footerNextBtn.classList.remove('lastTrack');
				}
				if (musicCurrentIndex==0){
					footerPreviousBtn.classList.add('firstTrack');
				} else {
					footerPreviousBtn.classList.remove('firstTrack');
				}
			}
			function updateTrackImage(){
				document.querySelector('#musicPlaylistCover').style.background= "no-repeat center / cover url("+musicArray[musicCurrentIndex].getAttribute('data-image')+")";
			}

			function play() {
				bgMusicElement.play();
				bgMusicIsPlaying = true;	
				footerPlayBtn.classList.add('isPlaying');
			} //play()

			if (event.key=="ArrowRight") {
				if (musicCurrentIndex+1 < musicArray.length){
					musicCurrentIndex = musicCurrentIndex+1;
					checkFirstAndLastTrack();
					document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
					musicArray[musicCurrentIndex].classList.add('focus');
					scrollIfNeeded(musicArray[musicCurrentIndex], document.querySelector('#musicPlaylist'));
					bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
					play();
					updateTrackImage();
				}//if
			} //ArrowLeft
			if (event.key=="ArrowLeft") {
				if (musicCurrentIndex>0){
					musicCurrentIndex = musicCurrentIndex-1;
					checkFirstAndLastTrack();
					document.querySelectorAll(".musicPlaylist li").forEach(function (track) {track.classList.remove('focus');});
					musicArray[musicCurrentIndex].classList.add('focus');
					scrollIfNeeded(musicArray[musicCurrentIndex], document.querySelector('#musicPlaylist'));
					bgMusicElement.setAttribute('src', musicArray[musicCurrentIndex].getAttribute('data-sound'));
					play();
					updateTrackImage();
				}//if			
			} //arrowRight
		}//musicPlaylistFolio

		if(currentScreen=='websitesFolio'){
			if (event.key=="ArrowRight") {
				if (websitesCurrentIndex<1){ websitesCurrentIndex= websitesCurrentIndex+1; }
				else if (websitesCurrentIndex==1) { websitesCurrentIndex = 0; }
				document.querySelectorAll('.websiteLink').forEach(function(link) {link.classList.remove('focus');});
				websitesArray[websitesCurrentIndex].classList.add('focus');

			}//ArrowRight
			if (event.key=="ArrowLeft") {
				if (websitesCurrentIndex>0){ websitesCurrentIndex= websitesCurrentIndex-1; }
				else if (websitesCurrentIndex==0) { websitesCurrentIndex = 1; }
				document.querySelectorAll('.websiteLink').forEach(function(link) {link.classList.remove('focus');});
				websitesArray[websitesCurrentIndex].classList.add('focus');
			}//ArrowLeft
			if (event.key=="Enter")
			{
				window.open(websitesArray[websitesCurrentIndex].getAttribute('href'));
			}
		}//websitesFolio

		if(document.querySelector('#'+currentScreen+ ' .gallery video')){
			if (event.key=="ArrowLeft"){
				document.querySelector('.slick-current video').play();
			}
			if (event.key=="ArrowRight"){
				document.querySelector('.slick-current video').play();
			}
			if (event.key=="Enter"){
				document.querySelector('.slick-current video').play();
			}
		}//video galleries

		if(document.querySelector('#'+currentScreen+' .largeVideo')){
			var thisVideo = document.querySelector('#'+currentScreen+ ' .largeVideo');
			if (event.key=="Enter"){
				if(thisVideo.currentTime > 0 && !thisVideo.paused && !thisVideo.ended && thisVideo.readyState > 2){
					thisVideo.pause(); 
					thisVideo.parentElement.querySelector('.videoPlayBtn').classList.remove('hidden');
					if (bgMusicElement.paused && unpauseMusicWhenDone==true)
					{
						bgMusicElement.play();
						bgMusicIsPlaying = true;
						footerPlayBtn.classList.add('isPlaying');
					}
				} else {
					thisVideo.play();
					thisVideo.parentElement.querySelector('.videoPlayBtn').classList.add('hidden');
					if (bgMusicIsPlaying==true && !thisVideo.muted){
						bgMusicElement.pause();
						bgMusicIsPlaying = false;
						footerPlayBtn.classList.remove('isPlaying');
						unpauseMusicWhenDone = true;
					} else {
						unpauseMusicWhenDone = false;
					}
				}		
			}
		}//large videos

		if(currentScreen=='about'){
			if (event.key=="Enter"){
				fakeHoverEvent(document.querySelector('#backToTop'));
				document.querySelector('#splashscreen').scrollIntoView();
			}
		}

	} // keyNavigation

	function mouseNavigation(){
		window.mobileAndTabletCheck = function() {
		//mobile and tablet do not have hover so we need to check for that.
  			let check = false;
  			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  			return check;
		};

		function rubricsHovers() {
			var allRubrics = document.querySelectorAll('.rubric');
			
			function rubricOverHandler(){
				allRubrics.forEach(link => link.classList.remove('focus'));
				this.classList.add('focus');
				rubricFocused = this.id.charAt(this.id.length - 1);
				var target ='#hnBtn' + rubricFocused;
				document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
				document.querySelector(target).classList.add('focus');
				hideIrrelevantFolios();
			}

			function rubricClickHandler(){

				goToFolios();
			}

			if (!window.mobileAndTabletCheck())
			{
				allRubrics.forEach(rubric => rubric.addEventListener('mousemove', rubricOverHandler));
				allRubrics.forEach(rubric => rubric.addEventListener('click', rubricClickHandler));		
			} else if (window.mobileAndTabletCheck()) {
				allRubrics.forEach(rubric => rubric.addEventListener('click', rubricOverHandler));
				allRubrics.forEach(rubric => rubric.addEventListener('dblclick', rubricClickHandler));						
			}
		}

		function splashscreenNavHoverHandler() {
			document.querySelectorAll('.splashNav a').forEach(function(link){link.classList.remove('focus');});
		}

		function websiteLinksHoverHandler() {
			document.querySelectorAll('.websiteLink').forEach(function(link){link.classList.remove('focus');});
			this.classList.add('focus');
			websitesCurrentIndex = websitesArray.indexOf(this);
		}

		function websiteLinksMouseoutHandler() {
			document.querySelectorAll('.websiteLink').forEach(function(link){link.classList.remove('focus');});
		}

		function displayBorderArrows(event) {
			var topArea= 3.5 * 38.4;
			var bottomArea= window.innerHeight - 3.5 * 38.4;
				if ( currentScreen!=='splashscreen' 
				& currentScreen!=='startScreen'

				& event.clientY > bottomArea 
				& event.clientY < window.innerHeight - 1.5 * 38.4
				& event.clientX > 0.4 * window.innerWidth
				& event.clientX < 0.6 * window.innerWidth) {
					document.querySelector('#bottomArrow').classList.remove('hidden');
				} else if ( currentScreen!=='splashscreen' 
				& currentScreen!=='startScreen'
				& event.clientY < topArea 
				& event.clientY > 1.5 * 38.4 
				& event.clientX > 0.4 * window.innerWidth
				& event.clientX < 0.6 * window.innerWidth) {
					document.querySelector('#topArrow').classList.remove('hidden');
				} else {
					document.querySelector('#topArrow').classList.add('hidden');
					document.querySelector('#bottomArrow').classList.add('hidden');
				}	
		}

		function clickTopArrow() {
			if(currentScreen=='rubrics'){
				document.querySelector('#splashscreen').scrollIntoView();
			} else {
				previousVisibleSibling(document.querySelector('#'+currentScreen)).scrollIntoView();
			}
		}
		function clickBottomArrow() {
			nextVisibleSibling(document.querySelector('#'+currentScreen)).scrollIntoView();
		}

		function largeVideoClickHandler() {
			thisVideo=this;
			if(thisVideo.currentTime > 0 && !thisVideo.paused && !thisVideo.ended && thisVideo.readyState > 2){
					thisVideo.pause(); 
					thisVideo.parentElement.querySelector('.videoPlayBtn').classList.remove('hidden');
					if (bgMusicElement.paused && unpauseMusicWhenDone==true)
					{
						bgMusicElement.play();
						bgMusicIsPlaying = true;
						footerPlayBtn.classList.add('isPlaying');
					}
				} else {
					thisVideo.play();
					thisVideo.parentElement.querySelector('.videoPlayBtn').classList.add('hidden');
					if (bgMusicIsPlaying==true && !thisVideo.muted){
						bgMusicElement.pause();
						bgMusicIsPlaying = false;
						footerPlayBtn.classList.remove('isPlaying');
						unpauseMusicWhenDone = true;
					} else {
						unpauseMusicWhenDone = false;
					}
				}		
		}

		function headerNavHandler() {
			function sortHeaderNav() {
				var target=this.getAttribute('data-target');
				document.querySelectorAll('.folio:not(.'+target+')').forEach(function(folio){folio.classList.add('hidden');});
				document.querySelectorAll('.'+target).forEach(function(folio){folio.classList.remove('hidden');});
				document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
				this.classList.add('focus');
				if (target== "folio3D"){ rubricFocused=1; }
				if (target== "folio2D"){ rubricFocused=2; }
				if (target== "folioAll"){ rubricFocused=3; }
				if (target== "folioMusic"){ rubricFocused=4; }
				if (target== "folioWeb"){ rubricFocused=5; }
				var idToFocus= '#rBtn' + rubricFocused;
				allRubrics.forEach(rubric => rubric.classList.remove('focus'));
				document.querySelector(idToFocus).classList.add('focus');
				nextVisibleSibling(document.querySelector('#rubrics')).scrollIntoView();
			}
			document.querySelectorAll('#headerNav a').forEach(function(link){
				link.addEventListener('click', sortHeaderNav);
			});

		}

		rubricsHovers();
		document.querySelectorAll('.splashNav a').forEach(function(link) {link.addEventListener('mousemove', splashscreenNavHoverHandler);});
		window.onmousemove = displayBorderArrows;
		document.querySelector('#topArrow').addEventListener('click', clickTopArrow);
		document.querySelector('#bottomArrow').addEventListener('click', clickBottomArrow);
		document.querySelectorAll('.websiteLink').forEach(function(link) {link.addEventListener('mousemove', websiteLinksHoverHandler);});
		document.querySelectorAll('.websiteLink').forEach(function(link) {link.addEventListener('mouseout', websiteLinksMouseoutHandler);});
		document.querySelectorAll('.largeVideo').forEach(function(video) {video.addEventListener('click', largeVideoClickHandler);});
		headerNavHandler();
	}// mousenavigation

	window.addEventListener('resize', reSnap);
	enterBtn.addEventListener('click', getIn);
	document.addEventListener('keydown', keyNavigation);
	mouseNavigation();

} // keynavigation()

function toolTips() {
	function mailCopiedToClipBoard(){
		var toolTip = document.createElement("span");
		toolTip.innerHTML="<span class='tooltipText'>Mail copied to clipboard !</span>";
		this.appendChild(toolTip);
		setTimeout(()=>{this.removeChild(toolTip);},3000);
	}
	document.querySelectorAll('.mailTooltip').forEach(function(mail) {mail.addEventListener('click', mailCopiedToClipBoard);});
}



// Functions are now exported and called from main.js
export { bgMusicControls, navigation, slickCarousel, toolTips, initLoadingScreen };