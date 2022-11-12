const poke_container = document.getElementById('poke-container')
const type_toggles = document.querySelectorAll('.toggle')
const filterBtn = document.getElementById('filter')
const body = document.querySelector('body')

// Number of pokemon to fetch
const pokemon_count = 904

const type_colors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dark: '#705848',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#F0B6BC'
}

let type_criteria = []

type_toggles.forEach(toggle => {
  const label = toggle.nextElementSibling

  label.style.opacity = '0.5'
  label.style.backgroundColor = type_colors[label.innerText.toLowerCase()]
  toggle.addEventListener('change', (e) => updateTypeCriteria(e.target))
})

const updateTypeCriteria = (toggle) => {
  const label = toggle.nextElementSibling

  if(toggle.checked) {
    label.style.opacity = '1'
    // label.style.backgroundColor = type_colors[label.innerText.toLowerCase()]
    type_criteria.push(toggle.id)
  } else {
    label.style.opacity = '0.5'
    // label.style.backgroundColor = type_colors[label.innerText.toLowerCase()] + 20
    type_criteria = type_criteria.filter(type => type !== toggle.id)
  }

  poke_container.innerHTML = ''
  fetchPokemons()
}

const fetchPokemons = async () => {
  // Disable toggles to prevent overlapping fetches from quick toggles
  type_toggles.forEach(toggle => toggle.disabled = true)

  // Hide loading pokemon
  poke_container.style.display = 'none'

  // Create and show a Loading message
  const loading = document.createElement('div')
  loading.classList.add('loading')
  loading.innerText = 'Loading...'
  body.appendChild(loading)

  for(let i = 1; i <= pokemon_count; i++) {
    await getPokemon(i)
  }

  // Enable toggle use
  type_toggles.forEach(toggle => toggle.disabled = false)

  // Remove Loading message
  body.removeChild(loading)

  // Show pokemon results
  poke_container.style.display = 'flex'
}

const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  const res = await fetch(url)
  const data = await res.json()

  //if pokemon has all types in filter criteria
  if(type_criteria.every(v => data.types.map(type => type.type.name).includes(v))) {
    createPokemonCard(data)
  }
}

const createPokemonCard = (pokemon) => {
  // Get pokemon data
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
  const id = pokemon.id.toString().padStart(3,'0')
  const poke_types = pokemon.types.map(type => type.type.name)
  const main_type = poke_types[0]
  const main_color = type_colors[main_type]

  // Make card div
  const pokemonEl = document.createElement('div')
  pokemonEl.classList.add('pokemon')
  pokemonEl.style.backgroundColor = main_color + '60'
  pokemonEl.innerHTML = `
  <div class="img-container">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="">
  </div>
  <div class="info">
    <span class="number">#${id}</span>
    <h3 class="name">${name}</h3>
  </div>
  `

  // Make types container
  const typesEl = document.createElement('div')
  typesEl.classList.add('types')

  // Add a type icon for each type
  poke_types.forEach(type => {
    const typeEl = document.createElement('div')
    typeEl.classList.add('type')
    typeEl.style.backgroundColor = type_colors[type]
    typeEl.innerText = type
    typesEl.appendChild(typeEl)
  })

  pokemonEl.appendChild(typesEl)

  poke_container.appendChild(pokemonEl)
}

fetchPokemons()