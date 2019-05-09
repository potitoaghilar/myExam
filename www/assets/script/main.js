
$(document).ready(async function () {

    // Show exam title
    $('#exam-title').text('"' + (await API.getExamTitle()) + '"');

    // Start a new session when we click on "Avvia Esame"
    $('#newSession').click(newSession);

    function newSession() {

        // Get login datas
        const nome = $('#nome').val();
        const cognome = $('#cognome').val();
        const matricola = $('#matricola').val();

        // Check if all fields are filled
        if(nome === '' || cognome === '' || matricola === '') {
            $('#error').modal('show').find('.modal-body').text('Inserisci i dati richiesti per iniziare l\'esame');
            return;
        }

        // Check if matricola has 6 chars only
        if(matricola.length != 6) {
            $('#error').modal('show').find('.modal-body').text('La matricola inserita deve contenere 6 caratteri');
            return;
        }

        // Prepare environment with some visual effects
        $('.logo').removeClass('col-9').addClass('col-6');
        $('.exam-title').fadeOut();
        $('#login-form').fadeOut();

        // Timer useful to wait the transitions triggered above
        setTimeout(function () {

            // Show the Loading spinner
            $('#loader').fadeIn();

            // Show user profile on top left
			$('#matricola_value').text(matricola);
			$('#nameSurname_value').text(nome + " " + cognome);
			
            // Instantiate session
            const session = new Session(nome, cognome, matricola);

            // Check login
            session.login();

        }, 1000);

    }

});
