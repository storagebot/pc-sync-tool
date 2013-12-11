(function(){
  var FLAGS = {
    'browserid': false,'ethnio-all': false,'hot_questions': false,'karma': true,'optimizely': true,'search-ab': true,'surveygizmo': false
    },
    SWITCHES = {
    'wiki-rebuild-on-demand': false,'karma': true,'track-article-reads': true,'hide-total-question-votes': true,'users-dont-limit-by-login': true
    },
    SAMPLES = {
    'inproduct-https': true
    };
  window.waffle = {
    "flag_is_active": function waffle_flag(flag_name) {
      
      return !!FLAGS[flag_name];
    },
    "switch_is_active": function waffle_switch(switch_name) {
      
      return !!SWITCHES[switch_name];
    },
    "sample_is_active": function waffle_sample(sample_name) {
      
      return !!SAMPLES[sample_name];
    }
  };
})();