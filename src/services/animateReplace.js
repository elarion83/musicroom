import { isVarExist, isVarNull } from "./utils";

export function returnAnimateReplace(animatedRefElements, replaceArray, replace) {
    animatedRefElements.forEach(animatedElem => {
        if(!isVarNull(animatedElem)) {
            var inAnimationClassName = animatedElem.className;
            var mapClassReplace = replaceArray;
            
            var outAnimationClassName = inAnimationClassName.replace(replace, function(matched){
                return mapClassReplace[matched];
            });
            animatedElem.className=outAnimationClassName;
        }
    });
}
