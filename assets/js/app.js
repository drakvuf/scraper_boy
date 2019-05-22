// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"
// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
const progress = document.querySelector('progress')
const progressText = document.querySelector('.progress span')
const trophy = document.querySelector('.trophy')
const resultFields = Array.from(document.querySelectorAll('.result'))
const resultTitle = document.querySelector('.result.title')
const resultAuthor = document.querySelector('.result.author')
const resultPublishedAt = document.querySelector('.result.published-at')
const resultCategory = document.querySelector('.result.category')
const resultContent = document.querySelector('.result.content')
const testForm = document.querySelector('.test-form')
const selectorForm = document.querySelector('.selector-form form')
const errorField = document.querySelector('.error')

function submitTestForm (event) {
  event.preventDefault()

  const testFormData = new FormData(testForm)
  const selectorFormData = new FormData(selectorForm)

  const url = testFormData.get('url')
  const selectors = {
    title: selectorFormData.get('article_selector[title]'),
    authors: selectorFormData.get('article_selector[authors]'),
    published_at: selectorFormData.get('article_selector[published_at]'),
    category: selectorFormData.get('article_selector[category]'),
    content: selectorFormData.get('article_selector[content]'),
  }
  console.log({selectors})
  const csrfToken = document
    .querySelector('meta[csrf-param="_csrf_token"]')
    .getAttribute('content')

  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken
  })

  fetch(`/test`, {
    headers,
    method: 'POST',
    body: JSON.stringify({url, selectors})
  })
    .then(response => response.json())
    .then(showResults)
    .catch(showError)
}

function showResults ({title, author, category, published_at, content}) {
  errorField.innerHTML = ''
  
  resultTitle.innerHTML = title
  resultAuthor.innerHTML = author
  resultPublishedAt.innerHTML = published_at
  resultCategory.innerHTML = category
  resultContent.innerHTML = content

  validateResults()
}

function validateResults () {
  progress.classList.remove('is-primary')
  progress.classList.remove('is-success')

  const score = resultFields.map(field => {
    const textLength = field.innerHTML.length
    field.classList.remove('is-success')
    field.classList.remove('is-error')

    if (textLength > 0) {
      field.classList.add('is-success')

      return 1
    } else {
      field.classList.add('is-error')

      return 0
    }
  }).reduce((sum, current) => sum + current, 0)

  progress.value = score
  progressText.innerHTML = score

  const resultClass = score < 5 ? 'is-primary' : 'is-success'
  
  progress.classList.add(resultClass)
}

function showError (error) {
  errorField.innerHTML = error.message
}

testForm.addEventListener('submit', submitTestForm)