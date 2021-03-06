<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [decompose.js/Composition](#decomposejscomposition)
-   [Composition](#composition)
    -   [valueOf](#valueof)
    -   [tree](#tree)
    -   [close](#close)
    -   [diffOf](#diffof)
-   [loaderCallback](#loadercallback)
-   [decompose.js](#decomposejs)
-   [decompose](#decompose)

## decompose.js/Composition

Contiene la clase `Composition`, usado para representar una composición de un elemento.

**Examples**

```javascript
import {Composition} from 'decompose.js'
import Composition from 'decompose.js/Composition'
const {Composition} = require('decompose.js')
const Composition = require('decompose.js/Composition')
```

## Composition

Entidad que reprecenta una composición de elementos.

**Properties**

-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol))** Nombre de la propiedad que contiene el valor.
-   `value` **any** contienen el puntero original al valor asignado.
-   `path` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol))>** Tiene como referencia el recorrido hasta el valor
                                                   del objeto root.
-   `children` **(null | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), any>)** Tiene como referencia los parametros del objeto.
-   `reference` **any** Contiene la referencia usado para contruir el
                                                   elemento.

**Examples**

```javascript
decompose({a: 3}) // => Composition { reference: function Object() {}, value: {a: 3}, ... }
```

### valueOf

Retornar el valor del elemento.

**Examples**

```javascript
// > composition
// Composition { reference: function Object() {...}, value: {a: 3}, ... }
composition.valueOf() // => {"a": 3}
```

### tree

Recorre todos los elementos del árbol.

**Parameters**

-   `loaderCallback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 
-   `load` **[loaderCallback](#loadercallback)** Tras una iteración usara la función load para ver el elemento
                                   recorrido.

**Examples**

```javascript
const composition = decompose({a: {b: 1, c: 3}})

composition.tree((value, name, path, comp, root) => {
    comp.value === value // => true
    comp.name === name // => true
    console.log(name, path, '=>', value)
})
// Out:
// null [] => {"a": {"b": 1, "c": 3}}
// a ['a'] => {"b": 1, "c": 3}
// b ['a', 'b'] => 1
// c ['a', 'c'] => 1
```

### close

> Porque? necesito una forma de reconstruir el valor, de tal forma que me permita tener una
> copia del elemento.

**Examples**

```javascript
const original = {a: { b: 1, c: 2 }}
const composition = decompose()

const copia = composition.clone() // => Object
{
    a: {
        b: 1,
        c: 2
    }
}

original === copia // => false
original.a === copia.a // => false
original.a.b === copia.a.b // => true
original.a.c === copia.a.c // => true

// ref lodash
_.isEqual(original, copia) // => true
```

Returns **any** Elemento copiado, usando como referencia el elemento padre.

### diffOf

> Porque? necesitamos saber si algo ha cambiado.
>
> Ojo, que no solo evaluá los elementos que han cambiado respecto de la composición los
> elementos nuevos no los reporta.

**Parameters**

-   `other` **any** Otro objeto el cual se quiere comparar.
-   `reporter` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)?** Esta función nos ayudara a saber que a cambiado.
-   `stopFirst` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Si se detiene en cuanto encuentre un conflicto. (optional, default `false`)

**Examples**

```javascript
const original = { a: {b: 1, c: 2} }
const composition = decompose(original)

original.a.b = 3
original // => { a: {b: 3, c: 2} }

const reporter = (value, name, path, comp, root) => {
  console.log(name, path, '=>', value)
}

composition.diffOf(original, reporter) // => false
// Out:
// b ["a", "b"] => 4
```

## loaderCallback

Es usado para mostrar los elementos que recorre.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `value` **any** correspondera al valor real del objeto que esta
                                        recorreiendo.
-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) | null)** Corre al nombre del valor que esta recorriendo.
-   `path` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol))>** Este es un arreglo de los nombres asociado a todos las
                                        propiedades ancestros para poder llegar al valor.
-   `comp` **[Composition](#composition)** Es la composición actual asociada al elemento entregado.
-   `root` **[Composition](#composition)** Entrega el la composición padre.

## decompose.js

**Parameters**

-   `value`  
-   `opts`   (optional, default `{}`)

**Examples**

```javascript
import decompose from 'decompose.js'
const decompose = require('decompose.js').default
```

## decompose

Este función lee un elemento y la descompone para retornar una composición del mismo.

**Parameters**

-   `value` **any** Valor para descomponer
-   `opts` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** alguna propiedades (optional, default `{}`)
    -   `opts.isOk` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** is ok. (optional, default `false`)

**Examples**

```javascript
decompose(3) // => Composition { reference: function Number() {...}, value: 3 }
```

Returns **[Composition](#composition)** Retorna la composición del elemento.
