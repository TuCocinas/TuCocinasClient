var TuCocinasApp = new Framework7({
	swipeBackPage: false,
	swipePanel: 'left'
});
var $$ = Dom7;
var url_server = 'http://192.168.1.3:8000/';
var var_loading = false;
var next_link = '';
var lastIndex = 0;
var maxItems = 0;

var mainView = TuCocinasApp.addView('.view-main', {
	dynamicNavbar: true
});
$$.ajaxSetup({
	timeout: 10000,
	error: function(xhr){
		var status = xhr.status;
		loading_empty();
		$$('.page').html(
			'<div class="msg-error text-center">'+
				'<img src="img/icon/warning.png">'+
				'<p><b>Error al conectar con el servidor</b></p>'+
			'</div>'
		);
	}
});
var home_page = TuCocinasApp.onPageInit('home', function(page){
	next_link = 'api/receta/lista/?format=json';
	lastIndex = 0;
	maxItems = 0;
	var_loading = false;
	$$('.page-content').addClass('hide-bars-on-scroll infinite-scroll');
	TuCocinasApp.attachInfiniteScroll($$('.infinite-scroll'));
	$$('[data-page="login"]').removeAttr('style');
	//toolbar_general();
	load_data_home();
});
var login_page = TuCocinasApp.onPageInit('login', function(page){
	$$('[data-page="login"]').attr('style', 'z-index:1000;');
});
$$(document).on('deviceready', function(device){
	if(localStorage.getItem("username") === null){
		$$('#login').trigger('click');
	}else{
		home_page.trigger();
	}
});
$$(document).on('infinite', '.infinite-scroll', function(){
	if(var_loading) return;
	var_loading = true;
	setTimeout(function (){
		var_loading = false;
		if(lastIndex >= maxItems){
			TuCocinasApp.detachInfiniteScroll($$('.infinite-scroll'));
			return;
		}else{
			lastIndex = $$('.content-white').length;
			load_data_home();
		}
	}, 1000);
});
$$(document).on('click', '.link-control-like', function(){
	if($$(this).attr('data-state') == 'enable'){
		$$(this).attr('data-state', 'disable').children().attr('src', 'img/icon/start_off.png');
	}else{
		$$(this).attr('data-state', 'enable').children().attr('src', 'img/icon/start_on.png');
	}
});
$$(document).on('click', '.like-control-heart', function(){
	if($$(this).attr('data-state') == 'enable'){
		$$(this).attr('data-state', 'disable').children('img').attr('src', 'img/icon/heart_like_off.png');
	}else{
		$$(this).attr('data-state', 'enable').children('img').attr('src', 'img/icon/heart_like_on.png');
	}
});
function load_data_home(){
	loading();
	if(next_link != null){
		$$.getJSON(url_server+next_link, {}, function(response){
			maxItems = response['count'];
			next_link = (response['next'])? next_link+'&'+response['next'].split('?')[1].slice(12): null;
			$$.each(response['results'], function(index, value){
				$$('#content_data').append(
					'<div class="content-white box-border-radius">'+
						'<a href="#">'+
							'<div class="content-image text-center">'+
								'<img src="'+url_server+value['receta_url_imagen']+'">'+
							'</div>'+
							'<div class="box-padding">'+
								'<div class="content-recipe">'+
									'<p class="title"><b>'+value['nombre_receta']+'</b></p>'+
									'<p class="description">'+value['descripcion_receta']+'</p>'+
								'</div>'+
							'</div>'+
						'</a>'+
						'<div class="content-control">'+
							'<a href="#" class="link-control-option like-control-heart" data-state="disable">'+
								'<img src="img/icon/heart_like_off.png">'+
								'<span>'+value['calificacion_receta']+'</span>'+
							'</a>'+
							'<a href="#" class="link-control-option">'+
								'<img src="img/icon/level_'+value['dificultad_receta_nombre']['nivel']+'.png">'+
								'<span>'+value['dificultad_receta_nombre']['dificultad']+'</span>'+
							'</a>'+
							'<a href="#" class="link-control-like" data-state="disable">'+
								'<img src="img/icon/start_off.png">'+
							'</a>'+
						'</div>'+
					'</div>'+
				'</div>'
				);
			});
			loading_empty();
		});
	}else{
		$$('#content_data').append(
			'<div class="content-white box-border-radius text-center">'+
				'<p><b>No hay más datos en el servidor</b></p>'+
			'</div>'
		);
		loading_empty();
	}
}
function loading_empty(){
	$$('.animation').html('');
}
function loading(){
	$$('.animation').html(
		"<div class='loading-animation'>"+
			"<div class='loading text-center box-border-radius'>"+
				"<span style='width:42px; height:42px' class='preloader'></span>"+
				"<p><b>Cargando</b></p>"+
			"</div>"+
		"</div>"
	);
}
function toolbar_general(){
	$$('.view').append(
		'<div class="toolbar tabbar tabbar-labels">'+
			'<div class="toolbar-inner">'+
				'<a href="index.html" class="link">'+
					'<i class="icon f7-icons">home_fill</i>'+
					'<span class="tabbar-label">Inicio</span>'+
				'</a>'+
				'<a href="#tab3" class="link">'+
					'<i class="icon f7-icons">star_fill</i>'+
					'<span class="tabbar-label">Favoritos</span>'+
				'</a>'+
				'<a href="#tab4" class="link">'+
					'<i class="icon f7-icons">persons_fill</i>'+
					'<span class="tabbar-label">Perfil</span>'+
				'</a>'+
				'<a href="html/about.html" class="link">'+
					'<i class="icon f7-icons">help_fill</i>'+
					'<span class="tabbar-label">Acerca</span>'+
				'</a>'+
			'</div>'+
		'</div>'
	);
}
/*
window.fbAsyncInit = function() {
			FB.init({
			  appId      : '1766257156978381',
			  xfbml      : true,
			  version    : 'v2.6'
			});
		  };

		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
$$("#btn_iniciarfacebook, #btn_iniciarfacebook_home").on( "click", function( event ) {
			//show_loading();
			// Conectar con facebook y pedir permisos
			FB.login(function(response) {
				console.log(response)
				// Login correcto con facebook, obtener datos
				var userId = response.authResponse.userID;
				var accessToken = response.authResponse.accessToken;
				var expiresIn = parseInt(response.authResponse.expiresIn);
				var installationId = "web_user";
				var onesignalPlayerID = "";
				if (response.status === 'connected') {
					// Logged into your app and Facebook.
					FB.api("/me?fields=id,first_name,last_name,email,picture.height(480).width(480)", function(result) {
						var fb_name = result.first_name;
						var fb_lastname = result.last_name;
						var fb_email = result.email;
						var fb_picture = result.picture.data.url;
						var fbLoginData = [userId, accessToken, expiresIn, fb_name, fb_lastname, fb_email, fb_picture, installationId, onesignalPlayerID];
						var data = {
							"action": "loginFB",
							"fbLoginData": fbLoginData
						};
						$.ajax({ url: server_url,
							data: data,
							type: 'POST',
							dataType: 'json',
							success: function(output) {
								if(output.error){
									showErrorServer();
								}
								else if(output.duplicado) {
									if(output.duplicadoKey == "username"){
										showErrorAlert('Usuario ya existente.');
									}
									else if(output.duplicadoKey == "email") {
										showErrorAlert('Correo ya existente.');
									}
									else {
										showErrorAlert('Una cuenta con estos datos ya existe.');
									}
								}
								else {
									if(output.login){
										localStorage.setItem("sessionToken", output.sessionToken);
										localStorage.setItem("id", output.id);
										localStorage.setItem("username", output.username);
										localStorage.setItem("email", output.email);
										localStorage.setItem("notifications", output.notifications);
										localStorage.setItem("name", output.name);
										localStorage.setItem("lastname", output.lastname);
										localStorage.setItem("phone", output.phone);
										localStorage.setItem("addresses", output.addresses);
										localStorage.setItem("profilePic", output.profilePic);
										localStorage.setItem("profilePicFacebook", output.profilePicFacebook);
										localStorage.setItem("gender", output.gender);
										localStorage.setItem("modoPago", output.modoPago);
									}
									else {
										localStorage.setItem("sessionToken", output.sessionToken);
										localStorage.setItem("id", output.id);
										localStorage.setItem("username", output.username);
										localStorage.setItem("email", output.email);
										localStorage.setItem("notifications", output.notifications);
										localStorage.setItem("name", output.name);
										localStorage.setItem("lastname", output.lastname);
										localStorage.setItem("profilePicFacebook", output.profilePicFacebook);
									}
									startapp();
									$(':mobile-pagecontainer').pagecontainer('change', '#page_tienda', {transition: 'none'});
								}
								hide_loading();
							},
							error: function(jqXHR, textStatus, errorThrown) {
								showErrorServer();
							}
						});
					});
				} else if (response.status === 'not_authorized') {
					// The person is logged into Facebook, but not your app.
					showAlertWithTitle('Se ha cancelado el inicio con facebook.', 'Cancelado');
				} else {
					// The person is not logged into Facebook, so we're not sure if
					// they are logged into this app or not.
					showAlertWithTitle('Se ha cancelado el inicio con facebook.', 'Cancelado');
				}
			});
		});
*/