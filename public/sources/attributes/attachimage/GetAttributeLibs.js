export default (value) => {
  const libs = []
  let filterName = null

  if (value instanceof Array) { // For multiple images
    filterName = value[0] && value[0] && value[0].filter
  } else { // For single image
    filterName = value && value.filter
  }

  if (filterName !== 'normal') {
    const libData = {
      name: 'imageFilter',
      dependencies: []
    }
    libs.push(libData)
  }

  return libs
}
