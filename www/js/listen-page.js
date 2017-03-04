$$(document).on('submit', '#signup-form', function(e){
	loading();
	e.preventDefault();
	var form = $$(this)[0];
	var data = {};
	if(form[0]['value'] != '' && form[1]['value'] != '' && form[2]['value'] != '' && form[3]['value'] != ''){
		data['method'] = form['method'];
		data['action'] = form['action'];
		data['error'] = 'El usuario ya está registrado';
		data['success'] = 'Te has registrado exitosamente';
		data['type'] = 'register_data';
		data['data'] = {
			'username': form[2]['value'],
			'first_name': form[0]['value'],
			'last_name': form[1]['value'],
			'email': form[2]['value'],
			'password': form[3]['value']
		}
		send_by_ajax(data);
	}else{
		TuCocinasApp.alert('Ingresa todos los campos', 'Error');
	}
});
$$(document).on('submit', '#login-form', function(e){
	loading();
	e.preventDefault();
	var form = $$(this)[0];
	var data = {};
	if(form[0]['value'] != '' && form[1]['value'] != ''){
		data['method'] = form['method'];
		data['action'] = form['action'];
		data['error'] = 'Datos incorrectos';
		data['success'] = 'Exito en el ingreso';
		data['type'] = 'login_data';
		data['data'] = {
			'username': form[0]['value'],
			'password': form[1]['value']
		}
		send_by_ajax(data);
	}else{
		TuCocinasApp.alert('Ingresa todos los campos', 'Error');
	}
});
$$(document).on('click', '#search-button', function(e){
	e.preventDefault();
	var form = $$('#search-form')[0];
	set_data('filter_search', '&search='+form[0]['value']+'&categoria='+form[1]['value']+'&tipo='+form[2]['value']+'&dificultad='+form[3]['value']+'&orden='+form[4]['value']);
	set_data('get_var_offset', '&limit=2');
	$$('#home-page').trigger('click');
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
	if(get_data('user') != null){
		var data = {};
		var sum_heart = 0;
		var element = $$(this);
		if(element.attr('data-state') == 'enable'){
			element.attr('data-state', 'disable').children().attr('src', 'img/icon/start_off.png');
		}else{
			element.attr('data-state', 'enable').children().attr('src', 'img/icon/start_on.png');
		}
		send_by_ajax_get({'href': element.attr('href')});
		send_by_ajax_get({'href': url_server+'api/receta/detalle/?slug_receta='+page.query.receta, 'type': 'save_data_offline'});
	}else{
		TuCocinasApp.alert('No has iniciado sesión aún', 'Error');
	}
});
$$(document).on('click', '.like-control-heart', function(event){
	if(get_data('user') != null){
		var data = {};
		var sum_heart = 0;
		var element = $$(this);
		if(element.attr('data-state') == 'enable'){
			element.attr('data-state', 'disable').children('img').attr('src', 'img/icon/heart_like_off.png');
			sum_heart = -1;
		}else{
			element.attr('data-state', 'enable').children('img').attr('src', 'img/icon/heart_like_on.png');
			sum_heart = 1;
		}
		element.children('span').text(parseInt(element.children('span').text()) + sum_heart);
		data['href'] = element.attr('href');
		data['sum_heart'] = sum_heart;
		send_by_ajax_get(data);
	}else{
		TuCocinasApp.alert('No has iniciado sesión aún', 'Error');
	}
});
$$(document).on('change', '.input-upload-receta-image', function(input){
	console.log(input)
	$$('.img-uploaded').attr('src', URL.createObjectURL(input.target.files[0]));
});
$$(document).on('click', '.option-in-save', function(input){
	var buttons = [
		{
			text: 'Guardar sin publicar',
			bold: true,
			color: 'red',
			onClick: function(){
				save_form_receta(false);
			}
		},
	];
	TuCocinasApp.actions(buttons);
});
$$(document).on('click', '#btn_add_ingrediente', function(event){
	var input_ingrediente = $$('#id_ingrediente_receta');
	if(input_ingrediente.val() != ''){
		$$('#ingrediente_receta_item').append(
			'<li class="row no-gutter">'+
				'<div class="col-90">'+
					'<input type="hidden" id="id_item_ingrediente" name="id_item_ingrediente" class="no-border" readonly value="'+input_ingrediente.val()+'" input-required="false">'+
					'<p style="margin: 0;">'+input_ingrediente.val()+'</p>'+
				'</div>'+
				'<div class="col-10">'+
					'<i class="icon f7-icons delete-item">close</i>'+
				'</div>'+
			'</li>'
		)
		input_ingrediente.val('');
	}else{
		TuCocinasApp.alert('El campo no puede ser vacío', 'Error');
	}
});
$$(document).on('click', '#btn_add_paso', function(event){
	var input_paso = $$('#id_paso_receta');
	item_n_paso += 1;
	if(input_paso.val() != ''){
		$$('#paso_receta_item').append(
			'<li class="row no-gutter">'+
				'<div class="col-100 show-image">'+
					'<img style="display: none;" class="img-background" id="item-'+item_n_paso+'">'+
					'<input type="hidden" name="#item-'+item_n_paso+'" input-required="false">'+
				'</div>'+
				'<div class="col-100">'+
					'<div class="row">'+
						'<div class="col-60">'+
							'<input type="hidden" name="id_item_paso" data-image="item-'+item_n_paso+'" class="no-border" readonly value="'+input_paso.val()+'" input-required="false">'+
							'<p style="margin: 0;">'+input_paso.val()+'</p>'+
						'</div>'+
						'<div class="col-40 text-center">'+
							'<div class="row">'+
								'<div class="col-50">'+
									'<i class="icon f7-icons camera-item" data-view="#item-'+item_n_paso+'" data-view-item="item-'+item_n_paso+'">camera_fill</i>'+
								'</div>'+
								'<div class="col-50">'+
									'<i class="icon f7-icons delete-item">close</i>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</li>'
		)
		input_paso.val('');
	}else{
		TuCocinasApp.alert('El campo no puede ser vacío', 'Error');
	}
});
$$(document).on('click', '.camera-item', function(event){
	show_image_paso_receta = $$(this).attr('data-view');
	var buttons = [
		{
			text: 'Tomar foto a la receta',
			bold: true,
			color: 'red',
			onClick: function(){
				CapturePhoto(show_image_paso_receta, show_image_paso_receta, 'camera');
			}
		},
		{
			text: 'Seleccionar foto de la galería',
			bold: true,
			color: 'red',
			onClick: function(){
				CapturePhoto(show_image_paso_receta, show_image_paso_receta, 'gallery');
			}
		},
	];
	TuCocinasApp.actions(buttons);
});
$$(document).on('click', '.delete-item', function(event){
	$$(this).parents('.row.no-gutter').remove();
});
$$(document).on('keypress', '#id_ingrediente_receta', function(event){
	if(event.which == 13){
		$$('#btn_add_ingrediente').trigger('click');
	}
});
$$(document).on('keypress', '#id_paso_receta', function(event){
	if(event.which == 13){
		$$('#btn_add_paso').trigger('click');
	}
});
$$(document).on('click', '.save-form-receta', function(){
	var return_val = true;
	$$.each($$('#form-save-receta')[0], function(index, input){
		if(return_val == true && input['attributes']['input-required'].value == 'true' && input['attributes']['type'] != 'file' && input.value == ''){
			TuCocinasApp.alert('El campo '+input['attributes']['title'].value+' está vacío', 'Error');
			return_val = false;
		}
	});
	if(return_val == true){
		save_form_receta(true);
	}
});
$$(document).on('click', '.input-upload-receta-image', function(){
	var this_type = $$(this);
	var buttons = [
		{
			text: 'Tomar foto a la receta',
			bold: true,
			color: 'red',
			onClick: function(){
				CapturePhoto(this_type.attr('data-view'), 'image_receta', 'camera');
			}
		},
		{
			text: 'Seleccionar foto de la galería',
			bold: true,
			color: 'red',
			onClick: function(){
				CapturePhoto(this_type.attr('data-view'), 'image_receta', 'gallery');
			}
		},
	];
	TuCocinasApp.actions(buttons);
});