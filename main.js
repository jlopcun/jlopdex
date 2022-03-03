const $id = el => document.getElementById(el);

const $searchPokemonForm = $id('searchPokemonForm');
const $PokemonContainer = $id('pokemonContainer');
const $pokemonCardTemplate = $id('pokemonCardTemplate').content;
const $favIcon = $id('favIcon');

const getPokemon = async (pokemon) =>{
    try{
        const fetching = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    if(!fetching.ok){
        throw (` An error ${fetching.status} has ocurred: ${fetching.statusText}`)
    } 
    const json = await fetching.json();
    const pokemonCardTemplateClone = $pokemonCardTemplate.cloneNode(true);
    const pokemonCard = pokemonCardTemplateClone.querySelector('.pokemonCard')
    const fragmentContent = document.createDocumentFragment();
    const getStat = (stat) => pokemonCard.querySelector(`.pokemonCard__${stat}`) || pokemonCard.querySelector(`.pokemonCard__info--${stat}`);
    getStat('name').textContent = json.name;
    getStat('sprite').src = json.sprites['front_default'];
    getStat('id').textContent = `id:${json.id}`;
    getStat('height').textContent = `height:${json.height/10}m`;
    getStat('weight').textContent = `weight:${json.weight/10}kg`;
    getStat('type').textContent = `types: ${json.types.map(x=>x.type.name).join(' ')}`;
    
    const moves = json.moves.map(x=>x.move.name);
    const fragmentMoves = document.createDocumentFragment();
    moves.forEach(move=>{
        const moveLi = document.createElement('li');
        moveLi.classList.add('pokemonCard__info--moves__li');
        moveLi.textContent = move;
        fragmentMoves.append(moveLi);
    })
    getStat('moves').append(fragmentMoves);
    
    const stats = json.stats.map(x=>{
        return {
            name:x.stat.name,
            value:x['base_stat']
        }
    })
    const fragmentStats = document.createDocumentFragment();
    stats.forEach(stat=>{
        const moveLi = document.createElement('li');
        moveLi.classList.add('pokemonCard__info--stats__li');
        moveLi.textContent = `${stat.name}:${stat.value}`;
        fragmentStats.append(moveLi);
    })
    getStat('stats').append(fragmentStats);

    fragmentContent.append(pokemonCardTemplateClone);
    $PokemonContainer.append(fragmentContent);
    const $movesOpener = pokemonCard.querySelector(".pokemonCard__info--arrow__moves");
    $movesOpener.addEventListener('click',()=>{
        $movesOpener.classList.toggle('active');
        getStat('moves').classList.toggle('active');
    })
    const $pokemonCardAddToFav = getStat('addToFav');
    const favIconImg = pokemonCard.querySelector('.favIcon__img');
    if(localStorage.getItem('favourites')){
        const favourites = localStorage.getItem('favourites');
        (favourites.includes(json.name))
        ?favIconImg.src = 'assets/star-svgrepo-com(active).svg'
        :'assets/star-svgrepo-com.svg'
    }
    $pokemonCardAddToFav.addEventListener('click',()=>{        
        const favIconImg = pokemonCard.querySelector('.favIcon__img');
        if(!favIconImg.src.includes('active')){
            (localStorage.getItem('favourites'))
            ?localStorage.setItem('favourites',`${Array.of(localStorage.getItem('favourites')).join(" ")} ${json.name}`)
            :localStorage.setItem('favourites',json.name);
            favIconImg.src = 'assets/star-svgrepo-com(active).svg';
        }
        else{
            const favourites = localStorage.getItem('favourites');
            const newFavourites = favourites.replace(json.name,"");
            localStorage.setItem('favourites',newFavourites)
            favIconImg.src = 'assets/star-svgrepo-com.svg';
        }
       
    })
    }
    catch(err){
        const Error = $id('Error');
        
        if(typeof err==='string'){
            Error.querySelector('.Error__msg').textContent=err;
            Error.classList.add('ErrorShow');
            document.body.classList.add('bodyStop');
            document.querySelector('.ErrorSolape').classList.add('ErrorShow');
            Error.querySelector('.Error__button').addEventListener('click',()=>{
            Error.classList.remove('ErrorShow');
            document.querySelector('.ErrorSolape').classList.remove('ErrorShow');
            document.body.classList.remove('bodyStop');
            })
        }
        
    }
}
$searchPokemonForm.addEventListener('submit',e=>{
    e.preventDefault();
    
    const pokemonValueToSearch = $searchPokemonForm.querySelector('.searchPokemonForm__input');
    getPokemon(pokemonValueToSearch.value.toLowerCase());
    pokemonValueToSearch.value="";
})


$favIcon.addEventListener('click',async ()=>{
    $PokemonContainer.textContent="";
    const favourites = localStorage.getItem('favourites').split(" ");
    if(favourites){
        favourites.forEach(pokemon=>{
            getPokemon(pokemon);
        })
    }
})

const $cleanBtn = $id('cleanBtn');
$cleanBtn.addEventListener('click',()=>{
    $PokemonContainer.textContent="";
})