define([
  'jquery',
  'partials',
  '../vendor/Lollipop.min',
  'model',
  'cookies']
, function ($, partials, Lollipop, model, cookies){

  return {
    start: function (callback, newGame){

      var
        $this = partials.customGame,
        $fieldWidth = $this.find('[name="field-width"]'),
        $minesAmount = $this.find('[name="mines-amount"]'),
        fieldWidthPrevValue = cookies.read('cg-fw'),
        minesAmountPrevValue = cookies.read('cg-ma');

      $this.find('.error').hide();

      if (minesAmountPrevValue !== null){
        $minesAmount.val(minesAmountPrevValue);
      }
      if (fieldWidthPrevValue !== null){
        $fieldWidth.val(fieldWidthPrevValue);
      }

      Lollipop.open({
        content:$this,
        title:'Custom game',
        showCancelButton: false,
        onOpen: function (){
          $this.find('form').on('submit', function (e){
            e.preventDefault();
            var
              fieldWidth = parseInt($fieldWidth.val()),
              minesAmount = parseInt($minesAmount.val());

            $this.find('.error').hide();

            if (!/^(0?[5-9]|1[0-9]|2[0-5])$/ig.test(fieldWidth)){
              $fieldWidth.parents('.custom-game-content-field-wrapper').find('.error').text('Deve ser um número entre 5 e 25').show();
              return;
            }

            if (!/^(0?[1-9]|[1-9][0-9]|100)$/ig.test(minesAmount)){
              $minesAmount.parents('.custom-game-content-field-wrapper').find('.error').text('Deve ser um número entre 5 e 25').show();
              return;
            }

            cookies.write('cg-fw', fieldWidth);
            cookies.write('cg-ma', minesAmount);

            var mines = Math.ceil((parseInt(fieldWidth) * parseInt(fieldWidth)) * (parseInt(minesAmount) / 100));
            callback(new model.GameSettings(fieldWidth, fieldWidth, mines));
            Lollipop.close();
            return false;
          });
        },
        buttons:[
          {
            title:'Start',
            click:function (){
              $this.find('form [type="submit"]').trigger('click');
            }
          },
          {
            title:'Cancel',
            click:function (){
              newGame.start(callback);
            }
          }
        ]
      });
    }
  }
});
