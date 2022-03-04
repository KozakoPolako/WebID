# WebID

## ENG:

Web application for obtaining and verifying identity documents (Thesis)
### System architecture diagram:
![Diagram architekrury systemu drawio](https://user-images.githubusercontent.com/79322668/156199463-662b9f58-64a4-487c-a614-d2247f918e11.png)

### Technologies:
* Vue.js
* Express
* MongoDB
* Docker
* Tesseract.js
* OpenCV
* Keycloak
### Installation guide:
#### Required software:
* Docker
#### Installation:
* set credentials in .env (last one leve empty for now),

![image](https://user-images.githubusercontent.com/79322668/156202248-5de878be-2997-457b-8f57-48b01210478f.png)
* run:
```shell
docker compose up --build
```
* wait for build end
* go to: localhost:8070, login and create new realm from file webid-auth/realm-export.jeson
* go to Realm Settings -> Keys and copy RS256 Public key
* save it as WEBID_REALM_PUBLIC_KEY in .env
* stop app in containers 
* run:
```shell
docker compose up --build
```
## PL:  

Aplikacja internetowa do pozyskania i weryfikacji dokumentów tożsamości (Praca dyplomowa)

### Diagram architektury systemu:
![Diagram architekrury systemu drawio](https://user-images.githubusercontent.com/79322668/156199463-662b9f58-64a4-487c-a614-d2247f918e11.png)
### Użyte technologie:
* Vue.js
* Express
* MongoDB
* Docker
* Tesseract.js
* OpenCV
* Keycloak
### Instrukcja instalacji:
#### Wymagane oprogramowanie:
* Docker
#### Instalacja:
* ustal poświadczenia w pliku .env (ostatnie pozostaw puste),

![image](https://user-images.githubusercontent.com/79322668/156202248-5de878be-2997-457b-8f57-48b01210478f.png)
* uruchom w terminalu:
```shell
docker compose up --build
```
* poczekaj aż aplikacja się zbuduje
* przejdź do: localhost:8070, zaloguj się oraz stwórz nową domenę z pliku webid-auth/realm-export.jeson
* przejdź do  Realm Settings -> Keys i skopiuj klucz publiczny RS256
* zapisz go jako WEBID_REALM_PUBLIC_KEY w .env
* zatrzymaj aplikacje  
* uruchom ponownie:
```shell
docker compose up --build
```




<!-- 
lines Count command : 
```shell
git ls-files | grep '\.ts\|\.js$\|\.vue\|\.py' | xargs wc -l
``` -->
