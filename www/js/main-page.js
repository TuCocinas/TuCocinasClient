var TuCocinasApp = new Framework7({
	swipeBackPage: false,
	swipePanel: 'left',
	fastClicks: false
});
var $$ = Dom7;
var url_server = 'http://tucocinas.herokuapp.com/';
//var url_server = 'http://192.168.43.169:8000/';
var next_link_home = 'api/receta/lista/?format=json';
var var_loading = true;
var next_to = true;
var lastIndex = 0;
var maxItems = 0;
var image_url = '';
var item_n_paso = 0;
var mainView = TuCocinasApp.addView('.view-main');

ajax_setup();

$$(document).on('deviceready', function(device){
	set_data('filter_search', '&');
	send_by_ajax_get({'href': url_server+'api/base/data/?format=json', 'type': 'init_data'});
	if(get_data('user') == null){
		$$('#login').trigger('click');
	}else{
		menu_user_lateral();
		home_page.trigger();
	}
});
var home_page = TuCocinasApp.onPageInit('home', function(page){
	next_to = true;
	lastIndex = 0;
	maxItems = 0;
	var_loading = false;
	set_data('get_var_offset', '&limit=2');
	$$('.page-content').addClass('hide-bars-on-scroll infinite-scroll');
	TuCocinasApp.attachInfiniteScroll($$('.infinite-scroll'));
	load_data_home();
	remove_style();
	toolbar_general();
	menu_user_lateral();
	$$('#home-option').removeClass('link-option').addClass('link-option-active');
});
var about_page = TuCocinasApp.onPageInit('about', function(page){
	toolbar_general();
	remove_style();
	menu_user_lateral();
	$$('.link').removeClass('link-option-active').addClass('link-option');
});
var search_page = TuCocinasApp.onPageInit('search', function(page){
	$$('#toolbar').removeClass('toolbar tabbar tabbar-labels').html('');
	remove_style();
	toolbar_search();
	$$.each(get_data('categoria'), function(index, value){
		$$('#id_categoria').append(
			'<option value="'+value['slug_categoria']+'">'+value['nombre_categoria']+'</option>'
		);
	});
	$$.each(get_data('tipo'), function(index, value){
		$$('#id_tipo').append(
			'<option value="'+value['slug_tipo']+'">'+value['nombre_tipo']+'</option>'
		);
	});
	$$.each(get_data('dificultad'), function(index, value){
		$$('#id_dificultad').append(
			'<option value="'+value['slug_dificultad']+'">'+value['nombre_dificultad']+'</option>'
		);
	});
	$$('#id_orden').val(getQueryVariable(get_data('filter_search'), 'orden'));
	$$('#id_word').val(getQueryVariable(get_data('filter_search'), 'search'));
	$$('#id_categoria').val(getQueryVariable(get_data('filter_search'), 'categoria'));
	$$('#id_tipo').val(getQueryVariable(get_data('filter_search'), 'tipo'));
	$$('#id_dificultad').val(getQueryVariable(get_data('filter_search'), 'dificultad'));
});
var nuevo_page = TuCocinasApp.onPageInit('nuevo', function(page){
	toolbar_nuevo();
	remove_style();
	menu_user_lateral();
	$$.each(get_data('dificultad'), function(index, value){
		$$('#id_dificultad_receta').append(
			'<option value="'+value['slug_dificultad']+'">'+value['nombre_dificultad']+'</option>'
		);
	});
	$$.each(get_data('categoria'), function(index, value){
		$$('#id_categoria_receta').append(
			'<option value="'+value['slug_categoria']+'">'+value['nombre_categoria']+'</option>'
		);
	});
	$$.each(get_data('tipo'), function(index, value){
		$$('#id_tipo_receta').append(
			'<option value="'+value['slug_tipo']+'">'+value['nombre_tipo']+'</option>'
		);
	});
});
var detail_page = TuCocinasApp.onPageInit('detail', function(page){
	toolbar_general();
	remove_style();
	menu_user_lateral();
	$$('.link').removeClass('link-option-active').addClass('link-option');
	if(page.query.receta){
		loading();
		send_by_ajax_get({'href': url_server+'api/receta/detalle/?slug_receta='+page.query.receta, 'type': 'detail_data'});
	}
});
var detail_paso_page = TuCocinasApp.onPageInit('detail-paso', function(page){
	numero_paso = page.query.paso_receta;
	toolbar_paso(numero_paso);
	remove_style();
	menu_user_lateral();
	receta = get_data('last-detail');
	if(receta['preparacion_receta'][numero_paso]['foto_paso'] != ''){
		$$('[data-page="detail-paso"] .page-img-detail').append(
			'<img src="'+url_server+receta['preparacion_receta'][numero_paso]['foto_paso']+'" class="img-background" id="img-detail-paso">'
		);
	}
	$$('[data-page="detail-paso"] .control-like').html(
		'<div class="content-white" '+(receta['preparacion_receta'][numero_paso]['foto_paso'] != '' ? 'style="margin-top: -10px;"': '')+'>'+
			'<div style="padding: 1px 10px;">'+
				'<p><b>Preparación de '+receta['nombre_receta']+'</b></p>'+
			'</div>'+
		'</div>'
	);
	$$('[data-page="detail-paso"] #content').html(
		'<div class="row">'+
			'<div class="col-10">'+
				'<span class="box-paso box-border-radius text-center">'+receta['preparacion_receta'][numero_paso]['orden_paso']+'</span>'+
			'</div>'+
			'<div class="col-90">'+
				'<p style="margin-top: 0px;">'+receta['preparacion_receta'][numero_paso]['descripcion_paso']+'</p>'+
			'</div>'+
		'</div>'
	);
});
var login_page = TuCocinasApp.onPageInit('login', function(page){
	$$('form#login-form').attr('action', url_server+'api/usuario/login/')
	$$('[data-page="login"]').attr('style', 'z-index:1000;');
	$$('#toolbar').removeClass('toolbar tabbar tabbar-labels').html('');
});
var signup_page = TuCocinasApp.onPageInit('signup', function(page){
	$$('form#signup-form').attr('action', url_server+'api/usuario/signup/')
	$$('[data-page="signup"]').attr('style', 'z-index:1000; background-color: white;');
	$$('#toolbar').removeClass('toolbar tabbar tabbar-labels').html('');
});
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