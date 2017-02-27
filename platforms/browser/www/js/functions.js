function getQueryVariable(query, variable){
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return('');
}
function remove_style(){
	$$('[data-page="login"]').removeAttr('style');
	$$('[data-page="signup"]').removeAttr('style');
}
function send_by_ajax(data){
	$$.ajax({
		type: data['method'],
		url: data['action'],
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data['data']),
		success: function(response){
			$$('#login').trigger('click');
			loading_empty();
			TuCocinasApp.alert(data['success'], 'Exito');
			select_function(data['type'], response);
		},
		error: function(response){
			TuCocinasApp.alert(data['error'], 'Error');
		}
	});
}
function send_by_ajax_get(data){
	$$.get(data['href'], function(response){
		select_function(data['type'], JSON.parse(response));
		loading_empty();
	});
}
function send_by_ajax_post(data){
	$$.post(data['href'], JSON.stringify(data['data']) , function(response){
		select_function(data['type'], JSON.parse(response));
		loading_empty();
	});
}
function select_function(type, data){
	switch (type){
		case 'login_data':
			login_data(data);
		break;
		case 'register_data':
			register_data(data);
		break;
		case 'like_button':
			like_button_event(data);
		break;
		case 'init_data':
			init_data_event(data);
		break;
		case 'detail_data':
			detail_data_event(data);
		break;
		case 'receta_data':
			receta_data_event(data);
		break;
		default: return null;
	}
}
function receta_data_event(data){
	TuCocinasApp.alert(data['msg'], data['type'])
	$$('.home-option').trigger('click');
}
function detail_data_event(data){
	set_data('last-detail', data);
	$$('#img-detail').attr('src', url_server+data['receta_url_imagen']);
	$$('[data-page="detail"] .control-like').html(
		'<div class="content-white" style="margin-top: -5px;">'+
			'<div class="content-control">'+
				'<span href="'+url_server+'api/receta/like-heart/?receta='+data['slug_receta']+'" class="link-control-option like-control-heart" data-state="'+((data['heart_like_receta_user'].indexOf((get_data('user') != null)? get_data('user')['email']: '') > -1)? 'enable': 'disable')+'" data-user="'+data['usuario_nombre']['token']+'" data-id="'+data['pk']+'">'+
					'<img src="img/icon/heart_like_'+((data['heart_like_receta_user'].indexOf((get_data('user') != null)? get_data('user')['email']: '') > -1)? 'on': 'off')+'.png">'+
					'<span>'+data['calificacion_receta']+'</span>'+
				'</span>'+
				'<span class="link-control-option">'+
					'<img src="img/icon/level_'+data['dificultad_receta_nombre']['nivel']+'.png">'+
					'<span>'+data['dificultad_receta_nombre']['dificultad']+'</span>'+
				'</span>'+
				'<span class="link-control-option">'+
					'<img src="img/icon/time.png">'+
					'<span>'+data['tiempo_preparacion_receta']+'</span>'+
				'</span>'+
				'<span class="link-control-option">'+
					'<img src="img/icon/portion.png">'+
					'<span>'+data['porciones_receta']+'</span>'+
				'</span>'+
				'<span href="#" class="link-control-like" data-state="disable">'+
					'<img src="img/icon/start_off.png">'+
				'</span>'+
			'</div>'+
		'</div>'
	);
	$$('[data-page="detail"] #content').html(
		'<div class="content-white box-border-radius">'+
			'<div style="padding: 1px 10px;">'+
				'<p class="title text-center"><b>'+data['nombre_receta']+'</b></p>'+
				'<p>'+data['descripcion_receta']+'</p>'+
				'<p><b>Ingredientes:</b></p>'+
				'<ul class="lista_ingrediente"></ul>'+
				'<p class="text-right">'+
					'<a href="html/detail-paso.html?paso_receta=0" class="link-inside">'+
						'Ver pasos para la preparación <i class="icon f7-icons">arrow_right_fill</i>'+
					'</a>'+
				'</p>'+
			'</div>'+
		'</div>'+
		'<p class="text-center">'+
			'<a class="btn-primary box-border-radius">'+
				'<i class="icon f7-icons">chat_fill</i> Ver los comentarios'+
			'</a>'+
		'</p>'
	);
	$$.each(data['ingrediente_receta'], function(index, value){
		$$('.lista_ingrediente').append(
			'<li>'+value+'</li>'
		);
	});
}
function init_data_event(data){
	TuCocinasApp.formStoreData('categoria', data['categoria']);
	TuCocinasApp.formStoreData('dificultad', data['dificultad']);
	TuCocinasApp.formStoreData('tipo', data['tipo']);
}
function login_data(data){
	set_data('user', data);
	ajax_setup();
	$$('#home').trigger('click');
}
function register_data(data){
	$$('#login').trigger('click');
}
function set_data(key, value){
	TuCocinasApp.formStoreData(key, value);
}
function get_data(key){
	return (TuCocinasApp.formGetData(key))? TuCocinasApp.formGetData(key): null;
}
function load_data_home(){
	loading();
	setTimeout(function(){
		console.log(get_data('filter_search'))
		if(next_to){
			$$.get(url_server+next_link_home+get_data('filter_search')+get_data('get_var_offset'), function(response){
				response = JSON.parse(response);
				maxItems = response['count'];
				if(response['next'] != null){
					set_data('get_var_offset', '&limit=2&offset='+getQueryVariable(response['next'], 'offset'));
				}else{
					next_to = false;
					set_data('get_var_offset', '&limit=2');
				}
				$$.each(response['results'], function(index, value){
					lastIndex =+ 1;
					$$('#content_data').append(
						'<div class="content-white box-border-radius">'+
							'<a href="html/detail.html?receta='+value['slug_receta']+'" class="link link-option" id="detail-option">'+
								'<div class="content-image text-center">'+
									'<img src="'+url_server+value['receta_url_imagen']+'" class="box-top-border-radius img-background">'+
								'</div>'+
								'<div class="box-padding">'+
									'<div class="content-recipe">'+
										'<p class="title"><b>'+value['nombre_receta']+'</b></p>'+
										'<p class="description">'+value['descripcion_receta'].substring(0,150)+'...</p>'+
									'</div>'+
								'</div>'+
							'</a>'+
							'<div class="content-control">'+
								'<span href="'+url_server+'api/receta/like-heart/?receta='+value['slug_receta']+'" class="link-control-option like-control-heart" data-state="'+((value['heart_like_receta_user'].indexOf((get_data('user') != null)? get_data('user')['email']: '') > -1)? 'enable': 'disable')+'" data-user="'+value['usuario_nombre']['token']+'" data-id="'+value['pk']+'">'+
									'<img src="img/icon/heart_like_'+((value['heart_like_receta_user'].indexOf((get_data('user') != null)? get_data('user')['email']: '') > -1)? 'on': 'off')+'.png">'+
									'<span>'+value['calificacion_receta']+'</span>'+
								'</span>'+
								'<span class="link-control-option">'+
									'<img src="img/icon/level_'+value['dificultad_receta_nombre']['nivel']+'.png">'+
									'<span>'+value['dificultad_receta_nombre']['dificultad']+'</span>'+
								'</span>'+
								'<span class="link-control-option">'+
									'<img src="img/icon/time.png">'+
									'<span>'+value['tiempo_preparacion_receta']+'</span>'+
								'</span>'+
								'<span href="'+url_server+'api/receta/like-star/?receta='+value['slug_receta']+'" class="link-control-option link-control-like" data-state="'+((value['star_like_receta_user'].indexOf((get_data('user') != null)? get_data('user')['email']: '') > -1)? 'enable': 'disable')+'" data-user="'+value['usuario_nombre']['token']+'" data-id="'+value['pk']+'">'+
									'<img src="img/icon/start_off.png">'+
								'</span>'+
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
					'<div style="padding: 1px;">'+
						'<p><b>No hay más datos en el servidor</b></p>'+
					'</div>'+
				'</div>'
			);
			loading_empty();
		}
	}, 1000);
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
function each_list(data_array){
	return_data = {};
	$$.each(data_array, function(index, data){
		return_data[index] = data.value;
	});
	return return_data;
}
function save_form_receta(on_save){
	loading();
	data = {};
	formReceta = $$('#form-save-receta')[0];
	lista_ingrediente = each_list(formReceta.id_item_ingrediente);
	lista_paso = each_list(formReceta.id_item_paso);
	data['href'] = url_server+'api/receta/nuevo/';
	data['error'] = 'Ha ocurrido un error';
	data['success'] = 'Receta guardada con éxito';
	data['type'] = 'receta_data';
	data['data'] = {
		'on_save': on_save,
		'data_receta': {
			'nombre_receta': formReceta.title_receta.value,
			'descripcion_receta': formReceta.descripcion_receta.value,
			'racion_receta': formReceta.racion_receta.value,
			'dificultad_receta': formReceta.dificultad_receta.value,
			'tiempo_receta': formReceta.tiempo_receta.value,
			'categoria_receta': formReceta.categoria_receta.value,
			'tipo_receta': formReceta.tipo_receta.value,
			'lista_ingrediente': lista_ingrediente,
			'lista_paso': lista_paso
		}
	}
	send_by_ajax_post(data);
}
function toolbar_general(){
	$$('#toolbar').removeAttr('class').attr('class', 'toolbar tabbar tabbar-labels').html(
		'<div class="toolbar-inner">'+
			'<a href="index.html" class="link link-option" id="home-option">'+
				'<i class="icon f7-icons">home_fill</i>'+
				'<span class="tabbar-label">Inicio</span>'+
			'</a>'+
			'<a href="html/search.html" class="link link-option">'+
				'<i class="icon f7-icons">search</i>'+
				'<span class="tabbar-label">Buscar</span>'+
			'</a>'+
		'</div>'
	);
	if(get_data('user') != null){
		$$('.toolbar-inner').append(
			'<a href="#" class="link link-option">'+
				'<i class="icon f7-icons">star_fill</i>'+
				'<span class="tabbar-label">Favoritos</span>'+
			'</a>'+
			'<a href="html/nuevo.html" class="link link-option">'+
				'<i class="icon f7-icons">add_round_fill</i>'+
				'<span class="tabbar-label">Nuevo</span>'+
			'</a>'
		);
	}
}
function menu_user_lateral(){
	if(get_data('user') != null){
		$$('#content-user').html(
			'<a href="html/profile.html" class="link close-panel" id="login">'+
				'<i class="icon f7-icons">person_fill</i>'+
				'<span>Mi perfil</span>'+
			'</a>'
		);
	}
}
function toolbar_search(){
	$$('#toolbar').removeAttr('class').attr('class', 'toolbar toolbar-bottom').html(
		'<div class="toolbar-inner">'+
			'<a href="index.html" class="link link-option" id="home-page">Atrás</a>'+
			'<a href="index.html" class="link link-option" id="search-button">Buscar</a>'+
		'</div>'
	);
}
function toolbar_paso(numero_paso){
	numero_paso = parseInt(numero_paso);
	numero_paso_next = (numero_paso + 1);
	receta = get_data('last-detail');
	$$('#toolbar').removeAttr('class').attr('class', 'toolbar toolbar-bottom').html(
		'<div class="toolbar-inner"></div>'
	);
	if(receta['preparacion_receta'][numero_paso - 1]){
		$$('.toolbar-inner').append(
			'<a href="html/detail-paso.html?paso_receta='+(numero_paso - 1)+'" class="link link-option">Anterior</a>'
		);
	}
	if(receta['preparacion_receta'][numero_paso_next]){
		$$('.toolbar-inner').append(
			'<a href="html/detail-paso.html?paso_receta='+numero_paso_next+'" class="link link-option">Siguiente</a>'
		);
	}else{
		$$('.toolbar-inner').append(
			'<a href="html/detail.html?receta='+receta['slug_receta']+'" class="link link-option">Finalizar</a>'
		);
	}
}
function toolbar_nuevo(){
	$$('#toolbar').removeAttr('class').attr('class', 'toolbar tabbar tabbar-labels').html(
		'<div class="toolbar-inner">'+
			'<a href="#" class="option-in-save link-option">'+
				'<i class="icon f7-icons">more_round_fill</i>'+
				'<span class="tabbar-label">Opciones</span>'+
			'</a>'+
			'<a class="save-form-receta box-paso box-border-radius link-option">'+
				'<span class="tabbar-label">Publicar</span>'+
			'</a>'+
			'<a href="index.html" class="link-option no-fastclick home-option">'+
				'<i class="icon f7-icons">close_round_fill</i>'+
				'<span class="tabbar-label">Cancelar</span>'+
			'</a>'+
		'</div>'
	);
}
function ajax_setup(){
	$$.ajaxSetup({
		timeout: 10000,
		beforeSend: function(xhr){
			xhr.requestParameters['contentType'] = 'application/json';
		},
		error: function(xhr){
			var status = xhr.status;
			loading_empty();
			TuCocinasApp.alert('Error al conectar con el servidor', 'Error');
		}
	});
	if(get_data('user') != null){
		$$.ajaxSetup({
			headers: {
				'Authorization': 'Token '+get_data('user')['token'],
				'Token': get_data('user')['token']
			}
		});
	}
}