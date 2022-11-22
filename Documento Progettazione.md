# Team
- **Project Manager**: Bonny
- **Frontend:** Sfriso, Magon
- **Backend:** Bressa, Mora

# Frontend
- **Tecnologie**:
    - NPM con framework Vue.js (Nuxt per gestire Vue)
    - TailwindCSS

# Backend
- **Tecnologie**:
    - Node.js + NPM
    - OAuth (con libreria Node `Passport`)
    - SQLite + libreria Node `Sequelize`
    - Libreria Node `Nodemailer`
    - Libreria Node `helmet`

# Domande
- Come gestire il prestito e restituzione?
- ~~Come rappresentare i dati?~~
- ~~Aggiungere login tramite Google e Facebook (OAuth)?~~
- Chi sono gli utenti che utilizzano il servizio (privati e aziende con diversi privilegi)?
- Notifiche per autorizzazione e scadenza del prestito (sempre se bisogna gestire restituzione dei prestiti)?

# Punti principali di sviluppo
- **Priorità 1**:
    - Registrazione/Login (OAuth e anche base con email/psw)
    - Logout
    - Inserimento prodotto che si vuole prestare
    - Pagina con lista di prodotti in prestito
    - Richiesta di prestito
    - Conferma di accettazione prestito
- **Priorità 2**:
    - Apertura del locker per deposito prodotto (c'è api per aprirli??)
    - Apertura del locker per ritiro prodotto (c'è api per aprirli??)
- **Priorità 3**:
    - Restituzione di prodotto prestato:
        - Apertura del locker per deposito prodotto a fine prestito
        - Apertura del locker per ritiro dell'prodotto a fine prestito
    - Modifica prodotto
- **Priorità 4**:
    - Pre-hash lato frontend delle password
    - Noleggio a pagamento
    - Passaggio a SQL più serio (tipo MySQL/MariaDB)
    - Notifiche push
    - Cambio password/password dimenticata

- **Sviluppi futuri**:
    - Clustering di utenti (tramite IA)
    - Sistema di feedback degli utenti e prestiti

---
# Parti principali del progetto
- Le comunicazioni avvengono tramite chiamate/risposte HTTP (GET & POST) e i dati vengono passati in oggetti `json`
- L'autenticazione avviene passando il token (ottenuto dal client in fase di login e signup) in un header chiamato `Auth-Token` (20 byte random generati dal server)
- Se server va in un errore non recuperabile (es. eccezione), risponde al client con 500 (`Internal Server Error`) 

## Route per le api:
- `/api/{categoria-oggetto}/{id?}`
    - Il metodo HTTP indica l'azione:
        - `GET`: ottieni elenco/singolo elemento (`id` opzionale)
        - `POST`: aggiungi nuovo oggetto (`id` non richiesto)
        - `PUT`: aggiorna oggetto (`id` richiesto)
        - `DELETE`: elimina oggetto (`id` richiesto)
    - `categoria-oggetto` può essere: `user`, `product`
   - `id` presente solo se si vuole accedere a, eliminare o modificare un elemento

### A parte il login e la registrazione, tutte le richieste necessitano di un header chiamato `token` per l'autenticazione e identificazione dell'utente

## Pagine del frontend
[[../../__media/Excalidraw/Drawing 2022-11-17 22.42.10.excalidraw]]
- **Priorità 1**:
    - ~~Login~~
    - ~~Registrazione~~
    - Login con OAuth
    - Registrazione con OAuth
    - ~~Elenco tutte prodotti~~
    - ~~Vista dettagli prodotto con tasto per richiesta prestito in locker specificato~~
    - Creazione prodotto
    - Modifica prodotto (con flag `available`)
    - Upload foto di prodotto
    - Pagina di conferma prestito per confermare prodotto depositato nel locker
- **Priorità 2**:
    - Elenco di prestiti attivi (sia prodotti dati che ricevuti)
    - Vista di storico prodotti inseriti
    - Vista di storico prestiti richiesti
- **Priorità 3**:
    - Pagina di termine prestito con conferma prodotto depositato
    - Vista tutti prodotti per utente
- **Priorità 4**:
    - Pagina di modifica/recupero password


# Interazioni frontend <-> backend
## Registrazione nuovo utente
| Num | Client                                                                                                                                                     | Direzione | Server                                                                                                                                    | Struttura dati                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Invia dati utenti                                                                                                                                          | ->        | POST `/api/signup`                                                                                                                        | `email`, `password`, `name`, `surname`, `dateOfBirth` (`dd-mm-yyyy`), `province` (intera), `gender` (`M/F/*`) |
| 2   |                                                                                                                                                            | <-        | Controlla se esiste già email registrata e se utente > 18 anni. Se tutto ok, risponde con 200 e token d'autenticazione e nome dell'utente | `errortext` (spiega in italiano errore a utente) OPPURE `token`, `name` e `surname`                           |
| 3   | Se risposta è 400, mostra `errortext`. Altrimenti salva token che poi utilizzerà negli header per autenticarsi. Chiede la lista dei locker della provincia | ->        | GET `/api/lockersList`                                                                                                                    |                                                                                                               |
| 4   |                                                                                                                                                            | <-        | Torna l'elenco di locker della provincia dell'utente                                                                                      | `listalocker` (array di oggetti json con: `id`, `nome`, `provincia`, `regione`, `address`)                    |
| 5   | Mostra lista di locker all'utente. L'utente li seleziona e invia quelli selezionati                                                                        | ->        | POST `/api/saveUserLockers`                                                                                                               | `lockers` (array di id locker)                                                                                |
| 6   |                                                                                                                                                            | <-        | Salva in db i locker selezionati, risponde con 200                                                                                        |                                                                                                               |
| 7   | Procede alla homepage                                                                                                                                      |           |                                                                                                                                           |                                                                                                               |

## Login senza OAuth
| Num | Client                                                                                                         | Direzione | Server                                                                                                                                                                                                                           | Struttura dati             |
| --- | -------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | Invia email e password                                                                                         | ->        | POST `api/signin`                                                                                                                                                                                                                | `email`, `password`        |
| 2   |                                                                                                                | <-        | Controlla in db se esiste account con email e password corrispondenti (nel db la password è hashata con salt) Risponde con 200 (credenziali valide) e rispondendo con un token e nome utente oppure 401 (credenziali non valide) | `token`, `name`, `surname` |
| 3   | Si salva il token nel local storage che poi utilizzerà negli header per autenticarsi nelle successive risposte | ->        |                                                                                                                                                                                                                                  |                            |

## Login con OAuth
GET `/api/signinGoogle`
GET `/api/signinGoogle/callback`
/aftergooglelogin?data={base64 del json}
oppure
GET `/api/signinFacebook`
GET `/api/signinFacebook/callback`
| Num | Client                                                                                                                                                                                                           | Direzione | Server                                                                                                                                                                                                                                                                                       | Struttura Dati                                                                                                                                             |     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1   | Comunica con autenticatore in base al tasto premuto (Google, Facebook...) fino ad ottenere i token necessari. Invia i token e il nome del servizio usato al server                                               | ->        |                                                                                                                                                                                                                                                                                              | `dati di OAuth`                                                                                                                                            |     |
| 2   |                                                                                                                                                                                                                  | <-        | Controlla con autenticatore se token è valido. Se è valido, controlla in DB se esiste già mail registrata. Se l'utente esiste già ma non aveva creato account con OAuth vengono uniti i dati. Se non esiste crea account e manda dati utente. Se esiste utente ritorna token di utilizzo app | `token` (se esiste già utente), `userData` (se non esisteva utente, oggetto json con: `name`, `surname`, `dateOfBirth` (`dd-mm-yyyy`), `gender` (`M/F/*`)) |     |
| 3   | Se non è presente token rimanda alla pagina di registrazione con dati utente precompilati. Se esiste salva il token nel local storage che poi utilizzerà negli header per autenticarsi nelle successive risposte |           |                                                                                                                                                                                                                                                                                              |                                                                                                                                                            |     |

## Lista di tutte le province italiane
| Num | Client | Direzione | Server                                                      | Struttura dati                  |
| --- | ------ | --------- | ----------------------------------------------------------- | ------------------------------- |
| 1   |        | ->        | GET `/api/provinces`                                        |                                 |
| 2   |        | <-        | Legge le province dal file apposito e le rimanda all'utente | `provinces` (array di stringhe) |

## Visualizza info utente
| Num | Client | Direzione | Server                                       | Struttura dati                                           |
| --- | ------ | --------- | -------------------------------------------- | -------------------------------------------------------- |
| 1   |        | ->        | GET `/api/user/{id}`                         |                                                          |
| 2   |        | <-        | Legge l'utente dal db e lo rimanda al client | `user` (oggetto con `id`, `name`, `surname`, `province`) |

## Creazione nuovo prodotto
| Num | Client                                                                                                           | Direzione | Server                                                                        | Struttura dati                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Invia i dati al server                                                                                           | ->        | POST `/api/product`                                                           | `title`, `description`, `maxLoanDays` (num, rappresenta giorni) |
| 2   |                                                                                                                  | <-        | Salva i dati in db, comunica al client esito (200 se ok, 400 se mancano dati) | `id` (del prodotto appena creata)                               |
| 3   | Notifica utente dell'esito, se ok chiede se caricare foto (vedere flusso sotto). Infine mostra il nuovo prodotto |           |                                                                               |                                                                 |

## Creazione/modifica immagine prodotto
| Num | Client | Direzione | Server                                                                                                                                                   | Struttura dati                                                                                                              |
| --- | ------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   |        | ->        | POST `/api/product/{id}/updateImage`                                                                                                                     | `image` (**Attenzione** non è json ma `multipart/form-data`. L'immagine può avere come mimetype `image/jpeg` o `image/png`) |
| 2   |        | <-        | Se è attivo un prestito con questo prodotto, torna 400. Altrimenti (comprime?) e salva foto come blob binario in db. Ritorna 200 oppure 500 se da errore |                                                                                                                             |

## Modifica prodotto
| Num | Client                        | Direzione | Server                                                                                                                                           | Struttura dati                                                                  |
| --- | ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 1   | Invia i dati al server        | ->        | PUT `/api/product/{id}`                                                                                                                          | `title`, `description`, `maxLoanDays` (num, rappresenta giorni), `availability` |
| 2   |                               | <-        | Se è attivo un prestito con questo prodotto, torna 400. Altrimenti salva i dati in db, comunica al client esito (200 se ok, 400 se mancano dati) |                                                                                 |
| 3   | Mostra il prodotto modificato |           |                                                                                                                                                  |                                                                                 |


## Visualizzazione singolo prodotto
| Num | Client                   | Direzione | Server                  | Struttura dati                                                                                                                                                                                                                                                            |
| --- | ------------------------ | --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Chiede info              | ->        | GET `/api/product/{id}` |                                                                                                                                                                                                                                                                           |
| 2   |                          | <-        |                         | `product` (oggetto con `id`, `ownerId`, `User` (oggetto con `name`, `surname` e `province`), `title`, `description`, `maxLoanDays`, `ownerProvince`,  `insertionDate`, `lockersList` (array di locker di oggetti json con: `id`, `name`, `province`, `region`, `address`) |
| 3   | Mostra i dati all'utente |           |                         |                                                                                                                                                                                                                                                                           |

## Visualizzazione immagine prodotto
(L'URL di questa API non verrà utilizzata come ajax ma come `src` del tag \<img\> HTML)
| Num | Client                                     | Direzione | Server                                                                           | Struttura dati |
| --- | ------------------------------------------ | --------- | -------------------------------------------------------------------------------- | -------------- |
| 1   |                                            | ->        | GET `/api/product/{id}/image`                                                    |                |
| 2   |                                            | <-        | Legge da db il blob dell'immagine del prodotto e lo rimanda indietro come stream | (lo stream)    |
| 3   | Visualizza l'immagine nel tag \<img\> HTML |           |                                                                                  |                |

## Visualizzazione elenco prodotti
| Num | Client                 | Direzione | Server                                                                                                            | Struttura dati                                                                                                                                               |
| --- | ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Chiede elenco prodotti | ->        | GET `/api/products`                                                                                               |                                                                                                                                                              |
| 2   |                        | <-        | Legge i prodotti dal db (dove `availability = true` e la provincia è la stessa del client) e li rimanda al client | `products` (array di oggetti composti da: `id`, `idOwner`, `User` (oggetto con: `nome` e `surname`), `title`, `description`, `maxLoanDays`, `insertionDate`) |

## Prenotazione prodotto
| Num | Client                                  | Direzione | Server                                                                                                                                                                                                                  | Struttura dati          |
| --- | --------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | Invia i dati al server                  | ->        | POST `/api/book`                                                                                                                                                                                                        | `productId`, `lockerId` |
| 2   |                                         | <-        | Chiama le API di Sintra per prenotare il primo slot libero del locker (se non trova locker disponibili, torna 409 (Conflict)). Salva avvio prestito nella tabella `userBorrowProducts` (200), notifica utenti con email |                         |
| 3   | Mostra conferma o errore 409 all'utente |           |                                                                                                                                                                                                                         |                         |

## Conferma prodotto depositato (da propietario)
| Num | Client | Direzione | Server                                                                                                               | Struttura dati |
| --- | ------ | --------- | -------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1   |        | ->        | GET `/api/start-loan`                                                                                                |                |
| 2   |        | <-        | Aggiorna il campo `startLoanDate` della tabella `userBorrowProducts`, invia email di conferma agli utenti, torna 200 |                |

## Elenco prestiti attivi (sia prodotti dati che ricevuti) e in attesa di conferma deposito
| Num | Client | Direzione | Server                                                                                                                                                                                                                                                       | Struttura dati                                                                                                                                      |
| --- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   |        | ->        | GET `/api/loan`                                                                                                                                                                                                                                              |                                                                                                                                                     |
| 2   |        | <-        | Legge la tabella `userBorrowProducts` le righe dove l'utente è proprietario oppure richiedente di un prestito e `terminationDate` è null. Calcola in base alla data corrente e al campo `maxLoanDays` dell'oggetto i giorni rimanenti alla fine del prestito | `loans` (array di oggetti con dati del prestito, dati dell'oggetto, flag `myProduct` (`true` o `false`) e flag `alreadyStarted` (`true` o `false`)) | 


## Storico prestiti effettuati
GET `/api/loan/ended`   **<--- DA CAMBIARE**

## Storico prestiti richiesti
GET `/api/loan/requested`

## Termine prestito con conferma prodotto depositato
GET `/api/loan/close`

## Lista prodotti per propietario
GET `/api/product/by-owner/{id}`   **<--- DA CONTROLLARE NOME**

## Modifica/recupero password

