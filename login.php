<?php
use MongoDB\Driver\ServerApi;

$uri = 'mongodb+srv://ayoxdev:AyoxDev0901@cluster0.msrvxfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Set the version of the Stable API on the client
$apiVersion = new ServerApi(ServerApi::V1);

// Create a new client and connect to the server
$client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);

try {
    // Send a ping to confirm a successful connection
    $client->selectDatabase('admin')->command(['ping' => 1]);
    echo "Pinged your deployment. You successfully connected to MongoDB!\n";
} catch (Exception $e) {
    printf($e->getMessage());
}

session_start();
// Vérifie si les données du formulaire sont envoyées
if (isset($_POST['email']) && isset($_POST['password'])) {
    // Connexion à la base de données
    // Remplacez les valeurs par vos informations de connexion à la base de données
    $db_username = 'root';
    $db_password = 'votre_mot_de_passe';
    $db_name = 'nom_de_votre_base_de_donnees';
    $db_host = 'localhost';
    $db = mysqli_connect($db_host, $db_username, $db_password, $db_name)
           or die('could not connect to database');

    // Sécurisation des données entrées par l'utilisateur
    $username = mysqli_real_escape_string($db, htmlspecialchars($_POST['username']));
    $password = mysqli_real_escape_string($db, htmlspecialchars($_POST['password']));

    // Vérification des identifiants
    if ($username !== "" && $password !== "") {
        $requete = "SELECT count() FROM utilisateur where 
                    nom_utilisateur = '".$username."' and mot_de_passe = '".$password."'";
        $exec_requete = mysqli_query($db, $requete);
        $reponse = mysqli_fetch_array($exec_requete);
        $count = $reponse['count()'];

        if ($count != 0) {
            $_SESSION['username'] = $username;
            header('Location: principale.php');
        } else {
            header('Location: login.php?erreur=1'); // Utilisateur ou mot de passe incorrect
        }
    } else {
        header('Location: login.php?erreur=2'); // Utilisateur ou mot de passe vide
    }
} else {
    header('Location: login.php');
}
mysqli_close($db); // Fermeture de la connexion
?>