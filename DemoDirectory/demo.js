$(document).ready(function() {
    var d_canvas = document.getElementById('canvas');
    var context = d_canvas.getContext('2d');
    var background = document.getElementById('background');
    var ballon = document.getElementById('ballon')
    context.drawImage(background, 0, 0);

    $('#ballon').draggable();

    $('#draw').click(function() {
        var $ballon = $('#ballon'),
            $canvas = $('#canvas');
        var ballon_x = $ballon.offset().left - $canvas.offset().left,
            ballon_y = $ballon.offset().top - $canvas.offset().top;

        context.drawImage(ballon, ballon_x, ballon_y);

        $ballon.hide();
        $(this).attr('disabled', 'disabled');
    });
});
