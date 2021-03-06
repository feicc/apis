const caches = {};

const delTimeoutInfo = {};


//////////////////////////

module.exports.del = (key='key', timeout=0)=>{
    let timeoutInfo = delTimeoutInfo[key];
    if(timeoutInfo) {
        clearTimeout(timeout);
        delete delTimeoutInfo[key];
    }

    let delFunc = function() {
        delete caches[key];
    }

    if(timeout==0)
        delFunc();
    else 
        delTimeoutInfo[key] = setTimeout(delFunc, timeout);
}


module.exports.set = (key='key', value=null, timeout=5000)=>{
    const now = Date.now();

    caches[key] = {
        value:      value,
        time:       now,
        maxTime:    now + timeout
    };

    module.exports.del(key, timeout);

    return caches[key];
};


module.exports.get = (key='key', addTimeout=0)=>{
    let cache = caches[key];

    if(!cache) 
        return {
            err:    1,
            errMsg: 'can`t match cache: '+key
        };

    if(addTimeout) {
        cache.maxTime = Date.now() + addTimeout;
        module.exports.del(key, addTimeout);
    }

    return {
        err:        0,
        value:      cache.value,
        time:       cache.time,
        maxTime:    cache.maxTime
    }
};
