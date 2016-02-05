# jquery.stackcolor

## Summary

A jQuery plugin for determining the average color of elements beneath another element.

Targets elements that have the `data-stackcolor` attribute to determine the average background color of elements the 
target element is over.

## Usage

The below example demonstrates a use case where the target element is set to the average color of the elements below it.

```html
<div class="fixed-elm"></div>
<div class="elm" id="elm1" data-stackcolor="true">
    <div class="elm" id="subelm1"></div>
    <div class="elm" id="subelm2"></div>
</div>
```

Setting the `data-stackcolor` attribute to `true` makes jquery.stackcolor iterate over all sub elements and take their 
background colors into consideration when calculating the average color.

```javascript
// Change target element color to average color of elements it is over
$('.fixed-elm').stackcolor({
    onResult: function(result) {
        result.elm.css('background', '#' + result.hex);
    }
});
```

## Author

Wil Neeley ( [@wilneeley](http://twitter.com/wilneeley) / [github.com](https://github.com/Xaxis) )
