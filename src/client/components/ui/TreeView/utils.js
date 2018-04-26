export function flattenTree(items) {
  return (items || []).reduce((results, item) => {
    if (!item.children || !item.children.length) {
      results.push(item)
    } else {
      results = results.concat(flattenTree(item.children))
    }
    return results
  }, [])
}
