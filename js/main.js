
/* --------------------------------------------------------------- */
/* Date stuff: */
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function get_date_time() {
	var today = new Date();
	var hour = today.getHours(),
		mins = today.getMinutes();
	var am_pm = hour > 12 ? 'pm': 'am';

	/* correct 'hour' format */
	if ( hour === 0 )   hour = 12;        /* convert hour value 0 -> 12, as in 12am midnight */
	else if (hour > 12) hour = hour % 12; /* prevent values over 12, maintain 12 hour clock */
	else                hour = hour;

	/* correct 'minute' format */
	if (mins.toString().length < 2)
		/* minute value (09).toString() would otherwise be represented as '9', as in 1:9, instead of 1:09 */
		mins = '0' + mins.toString();
	else
		mins = mins.toString();

	var time_string = hour.toString() + ':' + mins + ' ' + am_pm;

	return {
		'year': today.getFullYear(),
		'month': months[today.getMonth()],
		'date': today.getDate(),
		'day': days[today.getDay()],
		'raw': Date.now(),
		'time': time_string
	};
}



(function() {


	/* ---------------------------------------------------------------- */
	/* Handle any style/visual changes done by JS based on screen width */
	var $window = $(window),
		device_width = $window.width(),
		device_height = $window.height();
		breakpoint = '',
		new_breakpoint = '';

	/* determine current screen width and associated breakpoint */
	$window.on('resize', function() {

		device_width = $window.width();

		if (device_width >= 768) {
			new_breakpoint = 'desktop';
		} else if (device_width < 768 && device_width > 480) {
			new_breakpoint = 'tablet';
		} else {
			new_breakpoint = 'phone';
		}
		update_breakpoints(new_breakpoint);
	});

	/* if the breakpoint has changed, make changes as necessary */
	function update_breakpoints(updated_breakpoint) {
		if (breakpoint === updated_breakpoint) {
			return;
		} else {
			/* update views w/ new breakpoint */
			update_slider_orientation(updated_breakpoint);
		}
	}

	/* update jquery ui slider orientation */
	function update_slider_orientation(breakpoint) {
		if (breakpoint === 'desktop' || breakpoint === 'phone')
			$('.emotion_slider').slider({ orientation: 'horizontal'});
		else
			$('.emotion_slider').slider({ orientation: 'vertical'});
	}
	


	// --------------------
	// Memory Model
	var Memory_Model = Backbone.Model.extend({
		defaults: {

			'date_time': {
				'year': null,
				'month': null,
				'date': null,
				'day': null,
				'time': null,
				'raw': null
			},
			'memory_text': null,
			'media': {
				'image': null,
				'video':null,
				'audio':null
			},
			'is_core_memory': null,
			'emotions': {
				'joy': {
					'value': null,
					'percentage': null
				},
				'sadness': {
					'value': null,
					'percentage': null
				},
				'anger': {
					'value': null,
					'percentage': null
				},
				'fear': {
					'value': null,
					'percentage': null
				},
				'disgust': {
					'value': null,
					'percentage': null
				},
				'neutral': {
					'value': null,
					'percentage': null
				}
			},
			'gradient': {
				'default': null,
				'webkit': null,
				'moz': null
			}
		},
		get_current_time: function() {
			/* set date/time values once a new memory is saved */
			var current_time = get_date_time();
			this.attributes.date_time.year = current_time.year;
			this.attributes.date_time.month = current_time.month;
			this.attributes.date_time.date = current_time.date;
			this.attributes.date_time.day = current_time.day;
			this.attributes.date_time.time = current_time.time;
			this.attributes.date_time.raw = current_time.raw;
		},
		emotion_vals_to_percentages: function() {

			var emotions = this.attributes.emotions,
				total = 0;
			/* calculate total of emotion values */
			for(var emotion in emotions) {
				if (emotions[emotion].value)
					total += emotions[emotion].value;
			}
			/* assign percentage values to emotions using total */
			for (var emotion in emotions) {
				if (emotions[emotion].value)
					emotions[emotion].percentage = Math.floor( (emotions[emotion].value / total) * 100);
			}
		},
		percentages_to_gradient_string: function() {

			var current_percentage = 0,
				emotions = this.attributes.emotions,
				num_of_emotions = 0,
				i = 1, /* to act as index in the for in loop */
				str_value,
				gradient_str = 'linear-gradient(to bottom, '; /* partial css linear-gradient string */

			// determine number of emotions with values/percentages
			for ( var emotion in emotions ) 
				if (emotions[emotion].percentage) num_of_emotions++;

			// if only 1 emotion value, linear gradient is not used
			if (num_of_emotions === 1) {
				for (emotion in emotions)
					if (emotions[emotion].percentage) {
						this.attributes.gradient.default = emotion_translate(emotion, 'color');
						return;
					}
			}

			// build linear-gradient string
			for (emotion in emotions) {
				if (emotions[emotion].percentage) {
					if (i === num_of_emotions)
						str_value = ');'; /* this ends the css gradient_str */
					else {
						current_percentage += emotions[emotion].percentage;
						str_value = current_percentage + '%, ';
					}
					gradient_str += emotion_translate(emotion, 'color') + ' ' + str_value;
					i++;		
				}
			}
			this.attributes.gradient.default = gradient_str;
		}
	});



	// --------------------
	// Memories Collection (rename to hippocampus?)
	var Memory_Collection = Backbone.Collection.extend({
		model: Memory_Model,
		localStorage: new Backbone.LocalStorage('Memory_LocalStorage'),
		comparator: function(a, b) {
			return a.get('date_time')['raw'] < b.get('date_time')['raw'] ? -1 : 1;
		},
		greaterThan: function(value) {
			var filtered = this.filter(function(memory) {
				return memory.get('emotions')[value].percentage > 0;
			});
			return new Memory_Collection(filtered);
		}
	});
	var my_memory = new Memory_Collection();
	var superset = new Memory_Collection();
	my_memory.fetch();
	superset.fetch();





	// ---------------------
	// View for Control Panel
	var Control_Panel = Backbone.View.extend({
		el: $('#control_panel'),
		events: {
			'click #add_memory'              : 'add_memory',
			'change #sort_select'            : 'collection_sort',
			'change #filter_select'          : 'filter_by',
			'click .fa-search'              : 'toggle_search_input',
			'click #d3-view-toggle'          : 'open_d3_view',
			'click #d3-view-toggle.selected' : 'close_d3_view'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
		},
		add_memory: function() {
			memory_add_modal.render();
			app_router.navigate('new-memory');
		},
		collection_sort: function(e) {
			var val = $(e.currentTarget).val();
			if ( val === 'newest' || val === 'oldest' )
				memories.sort_by_date(val);
			else
				memories.sort_by_emotion(val);
		},
		filter_by: function(e) {
			var filter = $(e.currentTarget).val();
			if (filter === 'core-memory') {
				memories.filter_core_memory();
			} else {
				memories.filter_by_emotion(filter);	
			}		
		},
		toggle_search_input: function(e) {
			const $toggle = $(e.currentTarget);
			const $input = $('.search-input');
			$toggle.toggleClass('active');
			if ($toggle.hasClass('active')) {
				$input.removeClass('hidden');
			} else {
				$input.addClass('hidden');
			}
		},
		open_d3_view: function() {
			$('#d3-view-toggle').addClass('selected');
			$('#d3-container').addClass('visible');
			app_router.navigate('analytics');
		},
		close_d3_view: function() {
			$('#d3-view-toggle').removeClass('selected');
			$('#d3-container').removeClass('visible');
			app_router.navigate('');		
		}
	});
	var control_panel = new Control_Panel();




	// -------------------------
	// View for Add Memory Modal
	var Memory_Add_Modal = Backbone.View.extend({
		el: $('#add_memory_dialog'),
		events: {
			'click #modal_cancel'          : 'close',
			'click .modal_close'           : 'close',
			'click .input_attachment_icon' : 'toggle_attachment',
			'click #modal_reset'           : 'reset',
			'click #save_new_memory'       : 'save_memory',
			'click .add-attachment-btn'	   : 'add_attachment',
			'keyup #input_memory'          : function() { 
												this.validate();
												this.new_memory.attributes.memory_text = $('#input_memory').val();
											 },
			'click .core-memory-checkbox'  : function(e) {
												this.new_memory.attributes.is_core_memory = $(e.currentTarget).is(':checked');
											 }
		},
		initialize: function() {
			var view = this;

			view.new_memory = null;
			view.initialize_new_memory();
			autosize($('#input_memory'));

			/* determine orientation of sliders based on screen width */
			/* to be it's own function */
			/*  */
			var orientation = 'horizontal';
			if ((device_width > 480) && (device_width < 768))
				orientation = 'vertical';

			$('.emotion_slider').slider({
				orientation: orientation,
				change: function(e, ui) {
					view.validate(e, ui);
					var el_id = $(e.target).attr('id');
					var prop = el_id.substring(el_id.indexOf('_') + 1, el_id.length);
					view.new_memory.attributes.emotions[prop]['value'] = ui.value;
				},
				range: 'min',
				value: 0,
				min: 0,
				max: 5,
			});
		},
		render: function() {
			this.$el.addClass('view');
			$('.input_attachment_icon').removeClass('active');
			$('#input_memory').focus();
		},
		render_model_data: function() {

			var memory = this.new_memory.attributes;

			$('#input_memory').val(memory.memory_text);

			/* bind model 'Core Memory' bool to checkbox state */

			/* reset checkbox */
			$('.core-memory-checkbox').prop('checked', memory.is_core_memory);

			// emotions:
			for (emotion in memory.emotions) {
				this.render_emotion_slider(emotion, memory.emotions[emotion]['value']);
			}

			// attachments:
			// display checkmark icon if attachment has been added for each type
			for (attachment in memory.media) {
				this.render_attachment_status(attachment, memory.media[attachment])
			}
		},
		render_emotion_slider: function(emotion_type, emotion_value) {
			$('#slider_' + emotion_type).slider('value', emotion_value);
		},
		render_attachment_status: function(attachment_type, attachment_value) {
			switch (attachment_type) {
				case 'audio':
					var $attch_icon = $('#attachment_button_audio > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
				case 'image':
					var $attch_icon = $('#attachment_button_image > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
				case 'video':
					var $attch_icon = $('#attachment_button_video > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
			}
		},
		clear: function() {
			$('.core-memory-checkbox').prop('checked', false);
			$('#input_memory').val('');
			$('.emotion_slider').slider('value', 0);
		},
		close: function() {
			this.$el.removeClass('view');
			app_router.navigate('');
		},

		toggle_attachment: function(e) {
			var $icon = $(e.target).closest('.input_attachment_icon'),
				attachment_type = $icon.attr('data-attachment-type');
			
			$icon.toggleClass('active').siblings().removeClass('active');

			if ($icon.hasClass('active')) {
				this.toggle_attachment_input(attachment_type);
			} else {
				this.toggle_attachment_input(false);
			}
		},
		toggle_attachment_input: function(type) {
			var $input_div = $('.attachments_input[data-attachment-type="' + type + '"]');
			$('.attachments_input').addClass('hide');
			if (type) {
				
				switch (type) {
					case 'audio':
						$input_div.removeClass('hide');
						$('#audio_text_input').val(this.new_memory.attributes.media.audio);
						break;
					case 'image':
						$input_div.removeClass('hide');
						$('#image_text_input').val(this.new_memory.attributes.media.image);
						break;
					case 'video':
						$input_div.removeClass('hide');
						$('#video_text_input').val(this.new_memory.attributes.media.video);
						break;
					default:
						console.log('error - toggle_attachment_input');
						break;												
				}
			} else 
				$input_div.html('');
		},		
		validate: function(slide_event, slide_ui) {
			var view = this;

			// check for text input upon memory save
			if (! $('#input_memory').val() ) {
				//display_noty('warning', 'topCenter', 'Please enter a memory');
				view.handle_save_button('disable')
				return;
			}

			// check for emotion slider value(s) upon memory save
			var sliders_valid = false;
			this.$el.find('.emotion_slider').each(function(i, el) {
				if ( $(this).slider('value') > 0 ) {
					sliders_valid = true;
					return;
				}
			}).promise().done(function() {
				if (!sliders_valid) {
					//display_noty('warning', 'topCenter', 'Please enter an emotion value(s)');
					view.handle_save_button('disable');
					return;
				} else {
					view.handle_save_button('enable');
				}
			});

		},
		handle_save_button: function(action) {
			if (action === 'enable') {
				$('#save_new_memory').addClass('enabled');
			}
			else if (action === 'disable') {
				$('#save_new_memory').removeClass('enabled');
			}
		},

		add_attachment: function(e) {

			var type = $(e.target).attr('data-attachment-type');
			
			var input_val = $('#' + type + '_text_input').val();
			input_val = $.trim(input_val);
			if (input_val === '') {
				this.new_memory.attributes.media[type] = input_val;
				this.render_model_data();
				return;	
			}	
			if (this.validate_url(input_val)) {

				switch (type) {
					case 'audio':
						if (this.validate_audio_url(input_val)) {
							this.new_memory.attributes.media.audio = input_val;
							this.render_model_data();
							return;				
						} 
						else
							//alert ('Please enter on of the accepted audio/music based website urls:\nSoundcloud, Bandcamp, Youtube');
							display_noty('warning', 'topCenter', 'Please enter an accepted audio/music website url');
						break;
					case 'image':
						if (this.validate_image_url(input_val)) {
							this.new_memory.attributes.media.image = input_val;
							this.render_model_data();
							return;				
						} 
						else
							alert ('Please enter on of the accepted audio/music based website urls:\nSoundcloud, Bandcamp, Youtube');
						break;
					case 'video':
						if (this.validate_video_url(input_val)) {
							this.new_memory.attributes.media.video = input_val;
							this.render_model_data();
							return;				
						} 
						else
							alert ('Please enter on of the accepted audio/music based website urls:\nSoundcloud, Bandcamp, Youtube');
						break;										
				}
			} 
			else
				alert('Please enter a valid url\nex: https://google.com');	

			
		},
		add_image_attachment: function() {
			var $input_val = $('#image_text_input').val();
			this.new_memory.attributes.media.image = $input_val;
			this.render_model_data();
		},
		add_video_attachment: function() {
			var $input_val = $('#video_text_input').val();
			this.new_memory.attributes.media.video = $input_val;
			this.render_model_data();
		},
		validate_url: function(url) {
			return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
		},
		validate_audio_url: function(url) {
			return /soundcloud|bandcamp|youtube|\.(mp3|wav|ogg)$/i.test(url);
		},
		validate_image_url: function(url) {
			return /imgur|\.(jpg|jpeg|gif|png)$/i.test(url);
		},		
		validate_video_url: function(url) {
			return /youtube|vimeo|vine|\.(mp4|mov|mkv|avi|m4v)$/i.test(url);
		},		
		initialize_new_memory: function() {
			this.new_memory = new Memory_Model({
				'date_time': {
					'year': '',
					'month': '',
					'date': '',
					'day': '',
					'time': '',
					'raw': ''
				},
				'memory_text': '',
				'media': {
					'image': '',
					'video':'',
					'audio':''
				},
				'is_core_memory': false,
				'emotions': {
					'joy': {
						'value': 0,
						'percentage': 0
					},
					'sadness': {
						'value': 0,
						'percentage': 0
					},
					'anger': {
						'value': 0,
						'percentage': 0
					},
					'fear': {
						'value': 0,
						'percentage': 0
					},
					'disgust': {
						'value': 0,
						'percentage': 0
					},
					'neutral': {
						'value': 0,
						'percentage': 0
					}
				},
				'gradient': {
					'default': '',
					'webkit': '',
					'moz': ''
				}
			});
		},		
		save_memory: function(e) {

			if ($(e.target).hasClass('enabled')) {

				this.new_memory.get_current_time();
				this.new_memory.emotion_vals_to_percentages();
				this.new_memory.percentages_to_gradient_string();				

				my_memory.add(this.new_memory);
				this.new_memory.save();
		
				this.initialize_new_memory();
				this.close();
				this.clear();
			}
		},
		reset: function() {
			this.initialize_new_memory();
			this.render_model_data();
		}
	});
	var memory_add_modal = new Memory_Add_Modal();


	// ---------------------
	// View for Memory Display
	var Memory_Display = Backbone.View.extend({
		el: $('#memory_display'),
		events: {
			'click #memory-display-close'      : 'close_display',
			'click .memory-delete-text'        : 'delete_memory', 
			'click .memory-delete-cancel'      : 'toggle_confirm',
			'click .memory-display-delete .fa' : 'toggle_confirm', 
			'click .memory-toggle-audio'       : 'toggle_audio',
		},

		visible: false,

		initialize: function() {

			this.$media_text = $('.memory-audio-text');

			/* Music/audio info */
			this.audio_player = document.getElementById('memory-audio-player');
			this.current_audio = {
				artist: '',
				track: '',
				uri: ''
			}

			//this.close_display();

			this.$el.removeClass('invisible');
		},
		render: function(model) {
			var that = this;

			if (!this.visible) {
				this.$el.animate({
					top: '81px'
				}, 850, 'easeOutQuart', function() {
					that.visible = true;
					that.render_callback(model);
				});
			} else this.render_callback(model);
		},

		render_callback: function(model) {

			this.reset_memory_display_state();	
			this.current_memory = model;
			app_router.navigate('memory/' + (model.cid));

			var emotions = model.attributes.emotions;
			for (var emotion in emotions) {
				/* render emotions segment meter */
				if (emotions[emotion]['percentage'])
					$('.segment-' + emotion).css('width', emotions[emotion]['percentage']+'%');
			}

			/* todo: refactor into above loop */
			$('.memory-display-controls > i').addClass('hide');
			var media = model.attributes.media;
			for (var media_type in media) {
				if (media[media_type]) {
					switch (media_type) {
						case 'audio':
							$('.memory-display-controls > .fa-music').removeClass('hide');
							break;
						case 'image':
							$('.memory-display-controls > .fa-picture-o').removeClass('hide');
							break;	
						case 'video':
							$('.memory-display-controls > .fa-video-camera').removeClass('hide');
							break;					
					}
				}
			}

			this.$el.find('.memory-display-day').text(model.attributes.date_time.day);
			this.$el.find('.memory-display-time').text(model.attributes.date_time.time);			
			this.$el.find('.memory-display-month').text(model.attributes.date_time.month);
			this.$el.find('.memory-display-date').text(model.attributes.date_time.date);
			this.$el.find('.memory-display-year').text(model.attributes.date_time.year);
			this.$el.find('.memory-display-text').text(model.attributes.memory_text);

			/* Auto-play/display media */
			this.load_audio(model);
			this.load_image(model);
			this.load_video(model);			
		},

		reset_memory_display_state: function() {
			/* Reset state */
			this.set_audio_text(' ');
			this.reset_delete_confirm();
			$('.emotions-meter-segment').css('width', 0);
			this.$el.find('.memory-image-link').attr('href', '');
			this.$el.find('.memory-image-placeholder').attr('src', '').addClass('hide');
			this.$el.find('.memory-video-container').html('').addClass('hide');	
			this.$el.find('.memory-display-text').html('');
		},

		load_audio: function(model) {
			var that = this;
			var audio_url = model.attributes.media.audio;
			if (audio_url) {

				var get_url = 'http://api.soundcloud.com/resolve.json?url=' + audio_url + '&client_id=' + soundcloud_client_id;
				$.ajax({
					url: get_url,
					type: 'get',
					success: function(result) {
						var uri = result.uri + '/stream?client_id=' + soundcloud_client_id;

						that.current_audio.artist = result.user.username;
						that.current_audio.track = result.title;
						that.current_audio.uri = uri;

						$('#memory-audio-player').attr('src', uri);	
					},
					error: function(error) {
						console.log(error);
					}
				});
			}
		},
		play_audio: function() {
			this.audio_player.play();
		},
		toggle_audio: function() {
			if (this.audio_player.paused) {
				this.play_audio();
				this.set_audio_text(this.current_audio.artist + ' : ' + this.current_audio.track);
				// toggle music icon class to active
			} else {
				this.audio_player.pause();
				// toggle music icon class to inactive
			}
		},
		set_audio_text: function(text) {
			this.$media_text.text(text);
		},

		load_image: function(model) {
			var img_url = model.attributes.media.image;

			if ( (/\.(gif|jpg|jpeg|tiff|png)$/i).test(img_url) ) {
				$('.memory-image-placeholder').attr('src', img_url).removeClass('hide');
				$('.memory-image-link').attr('href', img_url);
			}

			else if ( /imgur/i.test(img_url) ) {
				$('.memory-image-placeholder').attr('src', (img_url + '.jpg')).removeClass('hide');
				$('.memory-image-link').attr('href', img_url);
			}

			else 
				 $('.memory-image-placeholder').addClass('hide');
		},

		load_video: function(model) {

			var video_url = model.attributes.media.video;

			if (video_url) {

				this.$el.find('.memory-video-container').removeClass('hide');

				if ( /youtube/i.test(video_url) ) {

					var youtube_embed = video_url.replace(/watch\?v=/, 'embed/');
					var iframe_str = '<iframe class="video-iframe" src="' + youtube_embed + '" frameborder="0"></iframe>'; 
					this.$el.find('.memory-video-container').append(iframe_str);

				} else if ( /vimeo/i.test(video_url) ) {

					var video_id = video_url.replace(/\D/g,'');
					var embed_url = 'https://player.vimeo.com/video/' + video_id;
					var iframe_str = '<iframe src="' + embed_url + '" class="video-iframe" frameborder="0"></iframe>';
					this.$el.find('.memory-video-container').append(iframe_str);
				}
			} 
			else {

				this.$el.find('.memory-video-container').addClass('hide');
				return;
			}

		},

		current_memory: '',
		close_display: function() {
			var that = this;
			this.audio_player.pause();

			var display_height = this.$el.height();

			this.$el.animate({
				top: '-'+display_height+'px',
			}, 850, 'easeOutQuart', function() {
				that.visible = false;
				/* todo: empty memory display */
				$('.memory-active').removeClass('memory-active');
				that.reset_memory_display_state();
			});
			app_router.navigate('');
		},
		toggle_confirm: function() {
			$('.memory-delete-text').toggleClass('visible');
			$('.delete-memory-icon').toggleClass('visible');
			$('.memory-delete-cancel').toggleClass('visible');
		},
		reset_delete_confirm: function() {
			$('.memory-delete-text').removeClass('visible');
			$('.delete-memory-icon').addClass('visible');
			$('.memory-delete-cancel').removeClass('visible');			
		},
		delete_memory: function(e) {
			this.toggle_confirm();
			this.current_memory.destroy();
			this.close_display();
		}
	});
	var memory_display_view = new Memory_Display();
	




	// --------------------------
	// View for individual memory
	var Memory_View = Backbone.View.extend({
		tagName: 'div',
		className: 'memory',
		events: {
			'click': 'view_memory',
		},
		template: _.template($('#memory_template').html()),
		render: function() {
			this.$el.html(this.template(this.model));
			this.$el.attr('style', 'background: ' + this.model.attributes.gradient.default.toString());

			if (this.model.attributes.is_core_memory) {
				this.$el.addClass('core-memory');
			}
			return this;
		},
		remove_memory: function() {
			this.model.destroy();	// delete model
			this.remove();			// delete view
		},
		// Custom Events
		view_memory: function() {
			if (this.$el.hasClass('memory-active')) {
				memory_display_view.close_display();
			} else {
				$('.memory-active').removeClass('memory-active')
				this.$el.addClass('memory-active');
				memory_display_view.render(this.model);				
			}
		}
	}); 




	var $memory_display = $('#memory_display'),
		$memory_number  = $('#memories_num');
	// --------------------------
	// View for Memory Collection
	var Memories_View = Backbone.View.extend({
		el: $('#memory_container'),
		events: {
			'click .sort_by_emotion' : 'sort_by_emotion',
		},
		initialize: function() {

			this.collection = my_memory;
			this.render();

			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.render, this);
		},

		render: function() {
			this.$el.html('');
			this.collection.each(function(memory) {
				var memory_view = new Memory_View({model: memory});
				this.$el.append(memory_view.render().el);
			}, this);
			$memory_number.text( this.$el.children('.memory').length );
			return this;
		},
		delete_collection: function() {
			this.collection.each(function(model) {
				model.destroy();
			});
			this.render();
		},

		sort_by_emotion: function(emotion) {
			this.collection.comparator = function(a, b) {
				return a.get('emotions')[emotion]['percentage'] < b.get('emotions')[emotion]['percentage'] ? -1 : 1;
			}
			this.collection.sort();
			this.render();
		},
		sort_by_date: function(direction) {
			if (direction === 'newest') {
				this.collection.comparator = function(a, b) {
					return a.get('date_time')['raw'] < b.get('date_time')['raw'] ? -1 : 1;
				}				
			} else if (direction === 'oldest') {
				this.collection.comparator = function(a, b) {
					return a.get('date_time')['raw'] > b.get('date_time')['raw'] ? -1 : 1;
				}		
			}

			this.collection.sort();
			this.render();
		},

		// triggered from control panel view
		filter_by_emotion: function(emotion) {

			this.collection.reset(superset.toJSON());
			if (emotion === 'all') {
				$('#memories_qty_label_prefix').text('');
				this.render();
				return;
			}
			var filtered = this.collection.filter(function(memory) {
				return (memory.get('emotions')[emotion]['value'] > 0);
			});
			$('#memories_qty_label_prefix').text( emotion_translate(emotion, 'adjective') );
			this.collection.reset(filtered);
			this.sort_by_emotion(emotion);
		},
		filter_core_memory: function() {
			this.collection.reset(superset.toJSON());
			var filtered = this.collection.filter(function(memory) {
				return (memory.get('is_core_memory'));
			});
			$('#memories_qty_label_prefix').text( 'Core' );
			this.collection.reset(filtered);
			this.render();

		}
		/* todo: filter by date - month/year/range/day of week */
	});
	var memories = new Memories_View(my_memory);


	var D3_View = Backbone.View.extend({
		el: $('#d3-container'),
		events: {
			'click #d3-view-toggle': 'toggle_visibility'
		},
		data_arr: {
		},
		close_view: function() {
			$('#d3-view-toggle').removeClass('selected');
			$('#d3-container').removeClass('visible');
			app_router.navigate('/');
		},
		initialize: function() {

			this.reset_data_arr();
			this.render();
		},
		render: function() {

			var self = this;
			var data = this.calculate();

			var max = d3.max(data, function(d) { return d.value; });
			var x_axis_len = data.length - 1;

			var margin = { 
				top: 0,
				right: 0,
				bottom: 0,
				left: 10
			};
			var width = 360 - margin.left - margin.right;
			var height = 350 - margin.top - margin.bottom;		

			var x = d3.scaleBand()
						.range([0, width])
						.padding(0.1);

			var y = d3.scaleLinear()
						.range([height, 0]);

			var svg = d3.select('#d3-graph').append('svg')
						.attr('width', width + margin.left + margin.right)
						.attr('height', height + margin.top + margin.bottom)
						.append('g')
							.attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

			data.forEach(function(d) {
				d.value = +d.value;
			});

			x.domain(data.map(function(d) { return d.emotion; }));
			y.domain([0, d3.max(data, function(d) { return d.value })]);

			svg.selectAll('.bar')
				.data(data)
				.enter()
					.append('rect')
					.attr('class', 'bar')
					.attr('x', function(d) { return x(d.emotion); })
					.attr('width', x.bandwidth())
					.attr('y', function(d) { return y(d.value); })
					.attr('height', function(d) { return height - y(d.value); })
					.attr('fill', function(d) { return emotion_translate(d.emotion, 'color') });

			svg.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.call(d3.axisBottom(x));

			svg.append('g')
				.call(d3.axisLeft(y));

		},
		calculate: function() {

			this.reset_data_arr();

			var self = this,
				data = self.data_arr,
				val_total = 0;

			my_memory.each(function(memory) {
				var emotions = memory.attributes.emotions;
				if (emotions.joy) {
					data[0].value += emotions.joy.value;
					val_total += emotions.joy.value;
				} 
				if (emotions.sadness) {
					data[1].value += emotions.sadness.value;
					val_total += emotions.sadness.value;
				} 
				if (emotions.anger) {
					data[2].value += emotions.anger.value;
					val_total += emotions.anger.value;
				} 
				if (emotions.fear) {
					data[3].value += emotions.fear.value;
					val_total += emotions.fear.value;
				} 
				if (emotions.disgust) {
					data[4].value += emotions.disgust.value;
					val_total += emotions.disgust.value;
				} 
				if (emotions.neutral) {
					data[5].value += emotions.neutral.value;
					val_total += emotions.neutral.value;
				} 
			});
			
			/* convert value for each emotion into a percentage as XX.X% */
			data.forEach(function(item, i) {
				data[i].percentage = parseFloat( ((data[i].value / val_total) * 100).toFixed(1) );
			});

			return data;
		},
		reset_data_arr: function() {
			this.data_arr = [
				{
					'emotion': 'joy',
					'value': 0,
					'percentage': 0
				},
				{
					'emotion': 'sadness',
					'value': 0,
					'percentage': 0
				},
				{
					'emotion': 'anger',
					'value': 0,
					'percentage': 0
				},
				{
					'emotion': 'fear',
					'value': 0,
					'percentage': 0
				},
				{
					'emotion': 'disgust',
					'value': 0,
					'percentage': 0
				},
				{
					'emotion': 'neutral',
					'value': 0,
					'percentage': 0
				}
			]
		},		
	});
	var d3_view = new D3_View();


	/* --------------------------------------------------------------------------- */
	/* Router */
	var App_Router = Backbone.Router.extend({
		routes: {
			''            : 'home_view',
			'new-memory'  : 'new_memory',
			'analytics'   : 'analytics',
			'memory/:cid' : 'memory' 
		},
		home_view: function() {
			memory_add_modal.close();
			d3_view.close_view();
		},
		new_memory: function() {
			memory_add_modal.render();
		},
		analytics: function() {
			control_panel.open_d3_view();
		},
		memory: function(cid) {
			var memory = my_memory.get(cid);
			memory_display_view.render(memory);
		}
		
	});
	var app_router = new App_Router();
	Backbone.history.start();


	/* --------------------------------------------------------------------------- */
	/* Extra Functions */

	// Sum all values (that are numbers) in an object
	function sum_obj_values(obj) {
		var sum = 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				sum += obj[prop];
		}
		return sum;
	}


	/* emotion => color or adjective string */
	function emotion_translate(emotion, flag) {
		/* 
			emotion => flag
			flags:
			'color' returns corresponding hex value
			'adjective' returns corresponding adjective
		*/
		switch (emotion) {
			case 'joy':
				return flag === 'color' ? '#F5F317' : 'Happy';
				break;
			case 'sadness':
				return flag === 'color' ? '#5380be' : 'Sad';
				break;
			case 'anger':
				return flag === 'color' ? '#db373e' : 'Angry';
				break;
			case 'fear':
				return flag === 'color' ? '#c3648e' : 'Scary';
				break;
			case 'disgust':
				return flag === 'color' ? '#73c557' : 'Disgusting';
				break;
			case 'neutral':
				return flag === 'color' ? '#ddd' : 'Neutral';
				break;																		
		}		
	}



	/* Utility Functions */
	function display_noty(type, location, msg) {
		var n = noty({
			type: type,
			layout: location,
			text: msg,
			timeout: 2000,
			modal: false,
			maxVisible: 5,
			closeWith: ['click']
		});
	}
	/*
		types: alert, success, error, warning, information, confirm
		layouts: top, topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight, bottom
	*/

})();

