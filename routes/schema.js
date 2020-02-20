let schema = {

    'title' : "Movie Structure",
    'type' : 'object',

    'properties': {
        'id': {'type': 'integer'},
        'title': {'type': 'string'},
        'overview': {'type': 'string'},
        'date': {'type': 'string'},
        'genre': {'type': 'array', "items": {"type": "string"}},
        'poster': {'type': 'string'},
        'backdrop': {'type': 'string'},
        'rate': {'type': 'number'},
    }

}

module.exports = schema;