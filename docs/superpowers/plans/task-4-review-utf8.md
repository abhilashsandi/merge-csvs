2a86159 fix(backend): correct test mock and AUTH_REQUIRED memory leak
f88cbc1 feat: implement express API for scheduler, isolate job logs, clear timeout properly
1e842a6 feat: implement express API for scheduler
 backend/package-lock.json          | 207 +++++++++++++++++++++++++++++++++++++
 backend/package.json               |   2 +
 backend/src/CaptchaSolver/index.ts |  12 +--
 backend/src/Client/index.ts        | 129 +++++++++++++----------
 backend/src/Interfaces/Config.ts   |  10 +-
 backend/src/server.test.ts         |  69 +++++++++++++
 backend/src/server.ts              | 108 +++++++++++++++++++
 7 files changed, 471 insertions(+), 66 deletions(-)
diff --git a/backend/package-lock.json b/backend/package-lock.json
index ae9aeef..09d0b98 100644
--- a/backend/package-lock.json
+++ b/backend/package-lock.json
@@ -24,21 +24,23 @@
         "uuid": "^10.0.0",
         "yaml": "^2.7.0",
         "zod": "^3.24.1"
       },
       "devDependencies": {
         "@types/cors": "^2.8.17",
         "@types/express": "^4.17.21",
         "@types/lodash": "^4.17.14",
         "@types/node": "^22.10.5",
         "@types/prompts": "^2.4.9",
+        "@types/supertest": "^7.2.0",
         "@types/uuid": "^10.0.0",
+        "supertest": "^7.2.2",
         "typescript": "^5.7.3"
       }
     },
     "node_modules/@babel/code-frame": {
       "version": "7.29.7",
       "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
       "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
       "license": "MIT",
       "dependencies": {
         "@babel/helper-validator-identifier": "^7.29.7",
@@ -51,20 +53,43 @@
     },
     "node_modules/@babel/helper-validator-identifier": {
       "version": "7.29.7",
       "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
       "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
       "license": "MIT",
       "engines": {
         "node": ">=6.9.0"
       }
     },
+    "node_modules/@noble/hashes": {
+      "version": "1.8.0",
+      "resolved": "https://registry.npmjs.org/@noble/hashes/-/hashes-1.8.0.tgz",
+      "integrity": "sha512-jCs9ldd7NwzpgXDIf6P3+NrHh9/sD6CQdxHyjQI+h/6rDNo88ypBxxz45UDuZHz9r3tNz7N/VInSVoVdtXEI4A==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^14.21.3 || >=16"
+      },
+      "funding": {
+        "url": "https://paulmillr.com/funding/"
+      }
+    },
+    "node_modules/@paralleldrive/cuid2": {
+      "version": "2.3.1",
+      "resolved": "https://registry.npmjs.org/@paralleldrive/cuid2/-/cuid2-2.3.1.tgz",
+      "integrity": "sha512-XO7cAxhnTZl0Yggq6jOgjiOHhbgcO4NqFqwSmQpjK3b6TEE6Uj/jfSk6wzYyemh3+I0sHirKSetjQwn5cZktFw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@noble/hashes": "^1.1.5"
+      }
+    },
     "node_modules/@puppeteer/browsers": {
       "version": "2.13.2",
       "resolved": "https://registry.npmjs.org/@puppeteer/browsers/-/browsers-2.13.2.tgz",
       "integrity": "sha512-5EUZSUIc37H6aIXyWO0Z4y8NlF8NnjgmqeQgOGiswAU7pY0HOo16ho4+alIWmSfdZnjqBRawMsP3I5YqLSn6kw==",
       "license": "Apache-2.0",
       "dependencies": {
         "debug": "^4.4.3",
         "extract-zip": "^2.0.1",
         "progress": "^2.0.3",
         "proxy-agent": "^6.5.0",
@@ -122,20 +147,27 @@
     "node_modules/@types/connect": {
       "version": "3.4.38",
       "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
       "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
       "dev": true,
       "license": "MIT",
       "dependencies": {
         "@types/node": "*"
       }
     },
+    "node_modules/@types/cookiejar": {
+      "version": "2.1.5",
+      "resolved": "https://registry.npmjs.org/@types/cookiejar/-/cookiejar-2.1.5.tgz",
+      "integrity": "sha512-he+DHOWReW0nghN24E1WUqM0efK4kI9oTqDm6XmK8ZPe2djZ90BSNdGnIyCLzCPw7/pogPlGbzI2wHGGmi4O/Q==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@types/cors": {
       "version": "2.8.19",
       "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
       "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
       "dev": true,
       "license": "MIT",
       "dependencies": {
         "@types/node": "*"
       }
     },
@@ -181,20 +213,27 @@
       "dev": true,
       "license": "MIT"
     },
     "node_modules/@types/lodash": {
       "version": "4.17.24",
       "resolved": "https://registry.npmjs.org/@types/lodash/-/lodash-4.17.24.tgz",
       "integrity": "sha512-gIW7lQLZbue7lRSWEFql49QJJWThrTFFeIMJdp3eH4tKoxm1OvEPg02rm4wCCSHS0cL3/Fizimb35b7k8atwsQ==",
       "dev": true,
       "license": "MIT"
     },
+    "node_modules/@types/methods": {
+      "version": "1.1.4",
+      "resolved": "https://registry.npmjs.org/@types/methods/-/methods-1.1.4.tgz",
+      "integrity": "sha512-ymXWVrDiCxTBE3+RIrrP533E70eA+9qu7zdWoHuOmGujkYtzf4HQF96b8nwHLqhuf4ykX61IGRIB38CC6/sImQ==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@types/mime": {
       "version": "1.3.5",
       "resolved": "https://registry.npmjs.org/@types/mime/-/mime-1.3.5.tgz",
       "integrity": "sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==",
       "dev": true,
       "license": "MIT"
     },
     "node_modules/@types/ms": {
       "version": "2.1.0",
       "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
@@ -262,20 +301,44 @@
       "version": "0.17.6",
       "resolved": "https://registry.npmjs.org/@types/send/-/send-0.17.6.tgz",
       "integrity": "sha512-Uqt8rPBE8SY0RK8JB1EzVOIZ32uqy8HwdxCnoCOsYrvnswqmFZ/k+9Ikidlk/ImhsdvBsloHbAlewb2IEBV/Og==",
       "dev": true,
       "license": "MIT",
       "dependencies": {
         "@types/mime": "^1",
         "@types/node": "*"
       }
     },
+    "node_modules/@types/superagent": {
+      "version": "8.1.10",
+      "resolved": "https://registry.npmjs.org/@types/superagent/-/superagent-8.1.10.tgz",
+      "integrity": "sha512-nbt4IWXABhW0jGmmpRzCFNlbmwCTzZ2gTUsNIr+X+ItdqPms+PAJZbWsNzpS2USqXjcoNLQcO6nXo60zcPQiIg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/cookiejar": "^2.1.5",
+        "@types/methods": "^1.1.4",
+        "@types/node": "*",
+        "form-data": "^4.0.0"
+      }
+    },
+    "node_modules/@types/supertest": {
+      "version": "7.2.0",
+      "resolved": "https://registry.npmjs.org/@types/supertest/-/supertest-7.2.0.tgz",
+      "integrity": "sha512-uh2Lv57xvggst6lCqNdFAmDSvoMG7M/HDtX4iUCquxQ5EGPtaPM5PL5Hmi7LCvOG8db7YaCPNJEeoI8s/WzIQw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/methods": "^1.1.4",
+        "@types/superagent": "^8.1.0"
+      }
+    },
     "node_modules/@types/uuid": {
       "version": "10.0.0",
       "resolved": "https://registry.npmjs.org/@types/uuid/-/uuid-10.0.0.tgz",
       "integrity": "sha512-7gqG38EyHgyP1S+7+xomFtL+ZNHcKv6DwNaCZmJmo1vgMugyF3TCnXVg4t1uk89mLNwnLtnY3TpOpCOyp1/xHQ==",
       "dev": true,
       "license": "MIT"
     },
     "node_modules/@types/yauzl": {
       "version": "2.10.3",
       "resolved": "https://registry.npmjs.org/@types/yauzl/-/yauzl-2.10.3.tgz",
@@ -372,20 +435,27 @@
       "engines": {
         "node": ">=0.10.0"
       }
     },
     "node_modules/array-flatten": {
       "version": "1.1.1",
       "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
       "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
       "license": "MIT"
     },
+    "node_modules/asap": {
+      "version": "2.0.6",
+      "resolved": "https://registry.npmjs.org/asap/-/asap-2.0.6.tgz",
+      "integrity": "sha512-BSHWgDSAiKs50o2Re8ppvp3seVHXSRM44cdSsT9FfNEUUZLOGWVCsiWaRPWM1Znn+mqZ1OfVZ3z3DWEzSp7hRA==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/ast-types": {
       "version": "0.13.4",
       "resolved": "https://registry.npmjs.org/ast-types/-/ast-types-0.13.4.tgz",
       "integrity": "sha512-x1FCFnFifvYDDzTaLII71vG5uvDwgtmDTEVWAxrgeiR8VjMONcCXJx7E+USjDtHlwFmt9MysbqgF9b9Vjr6w+w==",
       "license": "MIT",
       "dependencies": {
         "tslib": "^2.0.1"
       },
       "engines": {
         "node": ">=4"
@@ -692,20 +762,30 @@
       "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
       "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
       "license": "MIT",
       "dependencies": {
         "delayed-stream": "~1.0.0"
       },
       "engines": {
         "node": ">= 0.8"
       }
     },
+    "node_modules/component-emitter": {
+      "version": "1.3.1",
+      "resolved": "https://registry.npmjs.org/component-emitter/-/component-emitter-1.3.1.tgz",
+      "integrity": "sha512-T0+barUSQRTUQASh8bx02dl+DhF54GtIDY13Y3m9oWTklKbb3Wv974meRpeZ3lp1JpLVECWWNHC4vaG2XHXouQ==",
+      "dev": true,
+      "license": "MIT",
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
     "node_modules/concat-map": {
       "version": "0.0.1",
       "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
       "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
       "license": "MIT"
     },
     "node_modules/content-disposition": {
       "version": "0.5.4",
       "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
       "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
@@ -734,20 +814,27 @@
       "engines": {
         "node": ">= 0.6"
       }
     },
     "node_modules/cookie-signature": {
       "version": "1.0.7",
       "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.7.tgz",
       "integrity": "sha512-NXdYc3dLr47pBkpUCHtKSwIOQXLVn8dZEuywboCOJY/osA0wFSLlSawr3KN8qXJEyX66FcONTH8EIlVuK0yyFA==",
       "license": "MIT"
     },
+    "node_modules/cookiejar": {
+      "version": "2.1.4",
+      "resolved": "https://registry.npmjs.org/cookiejar/-/cookiejar-2.1.4.tgz",
+      "integrity": "sha512-LDx6oHrK+PhzLKJU9j5S7/Y3jM/mUHvD/DeI1WQmJn652iPC5Y4TBzC9l+5OMOXlyTTA+SmVUPm0HQUwpD5Jqw==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/cors": {
       "version": "2.8.6",
       "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
       "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
       "license": "MIT",
       "dependencies": {
         "object-assign": "^4",
         "vary": "^1"
       },
       "engines": {
@@ -859,20 +946,31 @@
         "npm": "1.2.8000 || >= 1.4.16"
       }
     },
     "node_modules/devtools-protocol": {
       "version": "0.0.1608973",
       "resolved": "https://registry.npmjs.org/devtools-protocol/-/devtools-protocol-0.0.1608973.tgz",
       "integrity": "sha512-Tpm17fxYzt+J7VrGdc1k8YdRqS3YV7se/M6KeemEqvUbq/n7At1rWVuXMxQgpWkdwSdIEKYbU//Bve+Shm4YNQ==",
       "license": "BSD-3-Clause",
       "peer": true
     },
+    "node_modules/dezalgo": {
+      "version": "1.0.4",
+      "resolved": "https://registry.npmjs.org/dezalgo/-/dezalgo-1.0.4.tgz",
+      "integrity": "sha512-rXSP0bf+5n0Qonsb+SVVfNfIsimO4HEtmnIpPHY8Q1UCzKlQrDMfdobr8nJOOsRgWCyMRqeSBQzmWUMq7zvVig==",
+      "dev": true,
+      "license": "ISC",
+      "dependencies": {
+        "asap": "^2.0.0",
+        "wrappy": "1"
+      }
+    },
     "node_modules/dotenv": {
       "version": "16.6.1",
       "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-16.6.1.tgz",
       "integrity": "sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==",
       "license": "BSD-2-Clause",
       "engines": {
         "node": ">=12"
       },
       "funding": {
         "url": "https://dotenvx.com"
@@ -1164,20 +1262,27 @@
       "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
       "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
       "license": "MIT"
     },
     "node_modules/fast-fifo": {
       "version": "1.3.2",
       "resolved": "https://registry.npmjs.org/fast-fifo/-/fast-fifo-1.3.2.tgz",
       "integrity": "sha512-/d9sfos4yxzpwkDkuN7k2SqFKtYNmCTzgfEpz82x34IM9/zc8KGxQoXg1liNC/izpRM/MBdt44Nmx41ZWqk+FQ==",
       "license": "MIT"
     },
+    "node_modules/fast-safe-stringify": {
+      "version": "2.1.1",
+      "resolved": "https://registry.npmjs.org/fast-safe-stringify/-/fast-safe-stringify-2.1.1.tgz",
+      "integrity": "sha512-W+KJc2dmILlPplD/H4K9l9LcAHAfPtP6BY84uVLXQ6Evcz9Lcg33Y2z1IVblT6xdY54PXYVHEv+0Wpq8Io6zkA==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/fd-slicer": {
       "version": "1.1.0",
       "resolved": "https://registry.npmjs.org/fd-slicer/-/fd-slicer-1.1.0.tgz",
       "integrity": "sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==",
       "license": "MIT",
       "dependencies": {
         "pend": "~1.2.0"
       }
     },
     "node_modules/finalhandler": {
@@ -1248,20 +1353,38 @@
         "asynckit": "^0.4.0",
         "combined-stream": "^1.0.8",
         "es-set-tostringtag": "^2.1.0",
         "hasown": "^2.0.4",
         "mime-types": "^2.1.35"
       },
       "engines": {
         "node": ">= 6"
       }
     },
+    "node_modules/formidable": {
+      "version": "3.5.4",
+      "resolved": "https://registry.npmjs.org/formidable/-/formidable-3.5.4.tgz",
+      "integrity": "sha512-YikH+7CUTOtP44ZTnUhR7Ic2UASBPOqmaRkRKxRbywPTe5VxF7RRCck4af9wutiZ/QKM5nME9Bie2fFaPz5Gug==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@paralleldrive/cuid2": "^2.2.2",
+        "dezalgo": "^1.0.4",
+        "once": "^1.4.0"
+      },
+      "engines": {
+        "node": ">=14.0.0"
+      },
+      "funding": {
+        "url": "https://ko-fi.com/tunnckoCore/commissions"
+      }
+    },
     "node_modules/forwarded": {
       "version": "0.2.0",
       "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
       "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
       "license": "MIT",
       "engines": {
         "node": ">= 0.6"
       }
     },
     "node_modules/fresh": {
@@ -3041,20 +3164,104 @@
       "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
       "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
       "license": "MIT",
       "dependencies": {
         "ansi-regex": "^5.0.1"
       },
       "engines": {
         "node": ">=8"
       }
     },
+    "node_modules/superagent": {
+      "version": "10.3.0",
+      "resolved": "https://registry.npmjs.org/superagent/-/superagent-10.3.0.tgz",
+      "integrity": "sha512-B+4Ik7ROgVKrQsXTV0Jwp2u+PXYLSlqtDAhYnkkD+zn3yg8s/zjA2MeGayPoY/KICrbitwneDHrjSotxKL+0XQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "component-emitter": "^1.3.1",
+        "cookiejar": "^2.1.4",
+        "debug": "^4.3.7",
+        "fast-safe-stringify": "^2.1.1",
+        "form-data": "^4.0.5",
+        "formidable": "^3.5.4",
+        "methods": "^1.1.2",
+        "mime": "2.6.0",
+        "qs": "^6.14.1"
+      },
+      "engines": {
+        "node": ">=14.18.0"
+      }
+    },
+    "node_modules/superagent/node_modules/debug": {
+      "version": "4.4.3",
+      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
+      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ms": "^2.1.3"
+      },
+      "engines": {
+        "node": ">=6.0"
+      },
+      "peerDependenciesMeta": {
+        "supports-color": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/superagent/node_modules/mime": {
+      "version": "2.6.0",
+      "resolved": "https://registry.npmjs.org/mime/-/mime-2.6.0.tgz",
+      "integrity": "sha512-USPkMeET31rOMiarsBNIHZKLGgvKc/LrjofAnBlOttf5ajRvqiRA8QsenbcooctK6d6Ts6aqZXBA+XbkKthiQg==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "mime": "cli.js"
+      },
+      "engines": {
+        "node": ">=4.0.0"
+      }
+    },
+    "node_modules/superagent/node_modules/ms": {
+      "version": "2.1.3",
+      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
+      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/supertest": {
+      "version": "7.2.2",
+      "resolved": "https://registry.npmjs.org/supertest/-/supertest-7.2.2.tgz",
+      "integrity": "sha512-oK8WG9diS3DlhdUkcFn4tkNIiIbBx9lI2ClF8K+b2/m8Eyv47LSawxUzZQSNKUrVb2KsqeTDCcjAAVPYaSLVTA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "cookie-signature": "^1.2.2",
+        "methods": "^1.1.2",
+        "superagent": "^10.3.0"
+      },
+      "engines": {
+        "node": ">=14.18.0"
+      }
+    },
+    "node_modules/supertest/node_modules/cookie-signature": {
+      "version": "1.2.2",
+      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
+      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.6.0"
+      }
+    },
     "node_modules/tar-fs": {
       "version": "3.1.2",
       "resolved": "https://registry.npmjs.org/tar-fs/-/tar-fs-3.1.2.tgz",
       "integrity": "sha512-QGxxTxxyleAdyM3kpFs14ymbYmNFrfY+pHj7Z8FgtbZ7w2//VAgLMac7sT6nRpIHjppXO2AwwEOg0bPFVRcmXw==",
       "license": "MIT",
       "dependencies": {
         "pump": "^3.0.0",
         "tar-stream": "^3.1.5"
       },
       "optionalDependencies": {
diff --git a/backend/package.json b/backend/package.json
index 92e52a7..0b3c91e 100644
--- a/backend/package.json
+++ b/backend/package.json
@@ -24,14 +24,16 @@
     "uuid": "^10.0.0",
     "yaml": "^2.7.0",
     "zod": "^3.24.1"
   },
   "devDependencies": {
     "@types/cors": "^2.8.17",
     "@types/express": "^4.17.21",
     "@types/lodash": "^4.17.14",
     "@types/node": "^22.10.5",
     "@types/prompts": "^2.4.9",
+    "@types/supertest": "^7.2.0",
     "@types/uuid": "^10.0.0",
+    "supertest": "^7.2.2",
     "typescript": "^5.7.3"
   }
 }
diff --git a/backend/src/CaptchaSolver/index.ts b/backend/src/CaptchaSolver/index.ts
index ad56b0b..61eea5c 100644
--- a/backend/src/CaptchaSolver/index.ts
+++ b/backend/src/CaptchaSolver/index.ts
@@ -1,34 +1,34 @@
 import * as Capsolver from './Capsolver';
 
 // 2captcha isn't stable
 // import * as TwoCaptcha from './2Captcha';
 
 import * as log from '../Log';
 import parseConfig from '../Config';
 const config = parseConfig();
 
 const CreateCaptchaSolverTask = () => {
-    switch (config.appSettings.captcha.solverOptions.solverService) {
+    switch (config.appSettings.captcha?.solverOptions?.solverService) {
         case 'capsolver':
-            return Capsolver.CapSolverCreateTask(config.appSettings.captcha.solverOptions.solverApiToken);
+            return Capsolver.CapSolverCreateTask(config.appSettings.captcha!.solverOptions!.solverApiToken!);
         // case '2captcha':
-        //     return TwoCaptcha.TwoCaptchaCreateTask(config.appSettings.captcha.solverOptions.solverApiToken);
+        //     return TwoCaptcha.TwoCaptchaCreateTask(config.appSettings.captcha!.solverOptions!.solverApiToken!);
         default:
             log.error('Unknown captcha solver service');
             throw new Error('Unknown captcha solver service');
     }
 };
 
 const GetCaptchaSolverResult = (taskId: string) => {
-    switch (config.appSettings.captcha.solverOptions.solverService) {
+    switch (config.appSettings.captcha?.solverOptions?.solverService) {
         case 'capsolver':
-            return Capsolver.CapSolverGetResult(taskId, config.appSettings.captcha.solverOptions.solverApiToken);
+            return Capsolver.CapSolverGetResult(taskId, config.appSettings.captcha!.solverOptions!.solverApiToken!);
         // case '2captcha':
-        //     return TwoCaptcha.TwoCaptchaGetResult(taskId, config.appSettings.captcha.solverOptions.solverApiToken);
+        //     return TwoCaptcha.TwoCaptchaGetResult(taskId, config.appSettings.captcha!.solverOptions!.solverApiToken!);
         default:
             log.error('Unknown captcha solver service');
             throw new Error('Unknown captcha solver service');
     }
 };
 
 export { CreateCaptchaSolverTask, GetCaptchaSolverResult };
diff --git a/backend/src/Client/index.ts b/backend/src/Client/index.ts
index 603e74f..0b8c55d 100644
--- a/backend/src/Client/index.ts
+++ b/backend/src/Client/index.ts
@@ -15,21 +15,21 @@ import type { AvailableLocationDatesPayload, AvailableLocationDatesResponse, Ava
 import type { HoldSlotPayload, HoldSlotResponse } from '../Interfaces/HoldSlot';
 import type { BookSlotPayload, BookSlotResponse } from '../Interfaces/BookSlot';
 import type { ExistBookingPayload, ExistBookingResponse } from '../Interfaces/ExistBooking';
 import type { CancelBookingPayload } from '../Interfaces/CancelBooking';
 import type { AuthPayload } from '../Interfaces/Auth';
 import { pushNotifcation } from '../PushNotification';
 
 import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
 import PQueue from 'p-queue';
 
-let packagejson;
+let packagejson: any = {};
 try {
     // eslint-disable-next-line @typescript-eslint/no-require-imports
     packagejson = require('../../package.json');
 } catch {
     try {
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         packagejson = require('../package.json');
     } catch {
         packagejson.version = null;
     }
@@ -39,76 +39,95 @@ interface CaptchaResult {
     captchaToken: string;
     userAgent: string;
 }
 
 export class TexasScheduler extends EventEmitter {
     private readonly requestClient = axios.create({
         baseURL: 'https://apptapi.txdpsscheduler.com',
         httpsAgent: new https.Agent({ rejectUnauthorized: false }),
     });
     public config: any;
+
+    public logInfo(message: string) {
+        log.info(message);
+        this.emit('log', { type: 'info', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
+    }
+    public logWarn(message: string) {
+        log.warn(message);
+        this.emit('log', { type: 'warn', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
+    }
+    public logError(message: string, err?: any) {
+        log.error(message, err);
+        const formatted = err ? `${message} ${err.message || err}` : message;
+        this.emit('log', { type: 'error', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${formatted}` });
+    }
+    public logDev(message: string) {
+        log.dev(message);
+        this.emit('log', { type: 'dev', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
+    }
+
     private abortController = new AbortController();
     private stopped = false;
     public existBooking: { exist: boolean; response: ExistBookingResponse[] } | undefined;
 
     private availableLocation: AvailableLocationResponse[] | null = null;
     private isBooked = false;
     private isHolded = false;
     private readonly queue = new PQueue({ concurrency: 1 });
     private authToken = '';
     private readonly maxCaptchaSolverRetries = 25;
     private responseId: number | null = null;
     private userAgent: string | null = null;
 
     public constructor(config: any) {
         super();
         this.config = config;
-        log.info(`Texas Scheduler v${packagejson.version} is starting...`);
-        log.info('Requesting Available Location....');
+        this.logInfo(`Texas Scheduler v${packagejson.version} is starting...`);
+        this.logInfo('Requesting Available Location....');
         if (!existsSync('cache')) mkdirSync('cache');
     }
 
     public stop() {
         this.stopped = true;
         this.abortController.abort();
         this.queue.pause();
         this.queue.clear();
-        log.info('Job stopped manually.');
+        this.logInfo('Job stopped manually.');
     }
 
     public submitManualToken(token: string) {
         this.authToken = token;
         this.emit('manual_token_received');
     }
 
     public async run() {
         try {
             if (existsSync('././cache/token.tmp')) {
-                log.info('Getting auth token from cache...');
+                this.logInfo('Getting auth token from cache...');
                 this.authToken = readFileSync('././cache/token.tmp', 'utf-8');
             } else await this.getAuthToken();
             if (this.responseId === null) await this.getResponseId();
             this.existBooking = await this.checkExistBooking();
             const { exist, response } = this.existBooking;
             if (exist) {
-                log.warn(`You have an existing booking at ${response[0].SiteName} ${dayjs(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
+                this.logWarn(`You have an existing booking at ${response[0].SiteName} ${dayjs(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
                 if (!this.config.appSettings.cancelIfExist) {
-                    log.warn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
+                    this.logWarn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
                 } else {
-                    log.warn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
+                    this.logWarn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
                 }
             }
             await this.requestAvailableLocation();
             await this.getLocationDatesAll();
         } catch (err: any) {
             if (err.name === 'AbortError' || err.code === 'ERR_CANCELED' || err.message === 'Aborted' || err.name === 'CanceledError') {
-                log.info('Scheduler aborted successfully.');
+                this.logInfo('Scheduler aborted successfully.');
             } else {
                 throw err;
             }
         }
     }
 
     private async checkExistBooking() {
         const requestBody: ExistBookingPayload = {
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
@@ -126,21 +145,21 @@ export class TexasScheduler extends EventEmitter {
 
     private async cancelBooking(ConfirmationNumber: string) {
         const requestBody: CancelBookingPayload = {
             ConfirmationNumber,
             DateOfBirth: this.config.personalInfo.dob,
             LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
         };
         await this.requestApi('/api/CancelBooking', 'POST', requestBody);
-        log.info('Canceled booking successfully');
+        this.logInfo('Canceled booking successfully');
     }
 
     public async getResponseId() {
         const requestBody: EligibilityPayload = {
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
             DateOfBirth: this.config.personalInfo.dob,
             LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
             CardNumber: this.config.personalInfo.cardNumber,
         };
@@ -182,27 +201,27 @@ export class TexasScheduler extends EventEmitter {
                   PreferredDay: 0,
                   TypeId: typeId,
                   ZipCode: identifier,
               };
 
         const response = await this.fetchLocationData(requestBody);
         const typeStr = isCity ? 'city' : 'zipcode';
         const typeStrCaps = isCity ? 'City' : 'zipcode';
 
         if (response === null) {
-            log.warn(`No location found for ${typeStr}: ${identifier}`);
+            this.logWarn(`No location found for ${typeStr}: ${identifier}`);
             try { await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal }); } catch { /* ignore */ }
             return [];
         }
 
         if (response.length !== 0) {
-            log.info(`Found ${response.length} locations for ${typeStrCaps}: ${identifier}`);
+            this.logInfo(`Found ${response.length} locations for ${typeStrCaps}: ${identifier}`);
         }
         response.forEach(el => {
             if (isCity) el.CityName = identifier;
             else el.ZipCode = identifier;
         });
         return response;
     }
 
     private async getLocationForCity(cityName: string, typeId: number): Promise<AvailableLocationResponse[]> {
         return this.getLocationHelper(cityName, true, typeId);
@@ -216,67 +235,67 @@ export class TexasScheduler extends EventEmitter {
         return await this.requestApi('/api/AvailableLocation/', 'POST', requestBody).then(res => res.data as AvailableLocationResponse[]);
     }
 
     private filterAndSortLocations(locations: AvailableLocationResponse[]): AvailableLocationResponse[] {
         return locations.sort((a, b) => a.Distance - b.Distance).filter((elem, index, self) => self.findIndex(obj => obj.Id === elem.Id) === index);
     }
 
     public async requestAvailableLocation(): Promise<void> {
         const response = await this.getAllLocation();
         if (response.length === 0) {
-            log.error('No Available location found! You can try add more zipcodes or set city name!');
+            this.logError('No Available location found! You can try add more zipcodes or set city name!');
             this.stop();
             return;
         }
         if (this.config.location.pickDPSLocation) {
             if (existsSync('././cache/location.json')) {
                 this.availableLocation = JSON.parse(readFileSync('././cache/location.json', 'utf-8'));
-                log.info('Found cached location selection, using cached location selection');
-                log.info('If you want to change location selection, please delete cache folder!');
+                this.logInfo('Found cached location selection, using cached location selection');
+                this.logInfo('If you want to change location selection, please delete cache folder!');
                 return;
             }
             const userResponse = await prompts({
                 type: 'multiselect',
                 name: 'location',
                 message: 'Choose DPS location, you can choose multiple locations!',
                 choices: response.map(el => ({
                     title: `${el.Name} - ${el.Address} - ${el.Distance} miles away from ${el.ZipCode ? el.ZipCode : el.CityName}!`,
                     value: el,
                 })),
                 onState: (state: { aborted: boolean }) => {
                     if (state.aborted) this.stop();
                 },
             });
             if (this.stopped) return;
             if (!userResponse.location || userResponse.location.length === 0) {
-                log.error('You must choose at least one location!');
+                this.logError('You must choose at least one location!');
                 this.stop();
                 return;
             }
             this.availableLocation = userResponse.location;
             writeFileSync('././cache/location.json', JSON.stringify(userResponse.location));
             return;
         }
         const filteredResponse = response.filter((location: AvailableLocationResponse) => location.Distance < this.config.location.miles);
         if (filteredResponse.length === 0) {
-            log.error(`No Available location found! Nearest location is ${response[0].Distance} miles away! Please change your config and try again!`);
+            this.logError(`No Available location found! Nearest location is ${response[0].Distance} miles away! Please change your config and try again!`);
             this.stop();
             return;
         }
-        log.info(`Found ${filteredResponse.length} Available location that match your criteria`);
-        log.info(`${filteredResponse.map(el => el.Name).join(', ')}`);
+        this.logInfo(`Found ${filteredResponse.length} Available location that match your criteria`);
+        this.logInfo(`${filteredResponse.map(el => el.Name).join(', ')}`);
         this.availableLocation = filteredResponse;
         return;
     }
 
     private async getLocationDatesAll() {
-        log.info('Checking Available Location Dates....');
+        this.logInfo('Checking Available Location Dates....');
         if (!this.availableLocation) return;
         const getLocationFunctions = this.availableLocation.map(location => () => sleep.setTimeout(5000, undefined, { signal: this.abortController.signal }).then(() => this.getLocationDates(location)));
         while (!this.stopped) {
             console.log('--------------------------------------------------------------------------------');
             await this.queue.addAll(getLocationFunctions).catch(() => null);
             try {
                 await sleep.setTimeout(this.config.appSettings.interval, undefined, { signal: this.abortController.signal });
             } catch (err: any) {
                 if (err.name === 'AbortError') break;
                 throw err;
@@ -318,42 +337,42 @@ export class TexasScheduler extends EventEmitter {
                     return startHour >= this.config.location.timesAround.start && startHour < this.config.location.timesAround.end;
                 });
                 return {
                     ...date,
                     AvailableTimeSlots: filteredTimeSlots,
                 };
             }).filter(date => date.AvailableTimeSlots.length > 0);
 
             const booking = filteredAvailabilityDates[0].AvailableTimeSlots[0];
 
-            log.info(`${location.Name} is Available on ${booking.FormattedStartDateTime}`);
+            this.logInfo(`${location.Name} is Available on ${booking.FormattedStartDateTime}`);
             if (!this.queue.isPaused) this.queue.pause();
             if (!this.config.appSettings.cancelIfExist && this.existBooking?.exist) {
-                log.warn('cancelIfExist is disabled! Please cancel existing appointment manually!');
+                this.logWarn('cancelIfExist is disabled! Please cancel existing appointment manually!');
                 this.stop();
                 return Promise.resolve(true);
             }
             this.holdSlot(booking, location);
             return Promise.resolve(true);
         }
-        log.info(
+        this.logInfo(
             `${location.Name} is not Available in ${locationConfig.sameDay
                 ? 'the same day'
                 : `around ${locationConfig.daysAround.start}-${locationConfig.daysAround.end} days from ${this.config.location.daysAround.startDate}!`
             } `,
         );
 
         return Promise.reject();
     }
 
     private async requestApi(path: string, method: 'GET' | 'POST', body: object, retryTime = 0): Promise<AxiosResponse> {
-        const headers = {
+        const headers: Record<string, string> = {
             'Accept': 'application/json, text/plain, */*',
             'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,te;q=0.6,hi;q=0.5',
             'Connection': 'keep-alive',
             'Content-Type': 'application/json;charset=UTF-8',
             'IsMFAEnabled': 'N',
             'Origin': 'https://www.txdpsscheduler.com',
             'Referer': 'https://www.txdpsscheduler.com/',
             'Sec-Fetch-Dest': 'empty',
             'Sec-Fetch-Mode': 'cors',
             'Sec-Fetch-Site': 'same-site',
@@ -368,124 +387,124 @@ export class TexasScheduler extends EventEmitter {
             method,
             url: path,
             headers,
             timeout: this.config.appSettings.headersTimeout,
             data: method === 'POST' ? body : undefined, // Include body only for POST requests
             validateStatus: () => true,
             signal: this.abortController.signal,
         });
 
         if (response.status !== 200) {
-            log.warn(`Got ${response.status} status code`);
-            log.info(`Endpoint: ${path}`);
-            log.dev(`Auth token: ${headers['Authorization']}`);
+            this.logWarn(`Got ${response.status} status code`);
+            this.logInfo(`Endpoint: ${path}`);
+            this.logDev(`Auth token: ${headers['Authorization']}`);
             if (response.status === 401) {
-                log.info('Auth token expired! Try to get new token...');
+                this.logInfo('Auth token expired! Try to get new token...');
                 await this.getAuthToken();
                 const repsonseIdStatus = await this.getResponseId();
 
                 if (repsonseIdStatus) {
-                    log.info('Auth token valid!');
-                    log.info('Sleeping for 5s...');
+                    this.logInfo('Auth token valid!');
+                    this.logInfo('Sleeping for 5s...');
                     await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
                 }
             }
             if (response.status === 403) {
-                log.warn('Got rate limited, sleep for 10s...');
+                this.logWarn('Got rate limited, sleep for 10s...');
                 await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
                 return this.requestApi(path, method, body, retryTime + 1);
             }
             if (retryTime < this.config.appSettings.maxRetry) {
-                log.info(`Retrying failed request... (Retry ${retryTime + 1}/${this.config.appSettings.maxRetry})`);
+                this.logInfo(`Retrying failed request... (Retry ${retryTime + 1}/${this.config.appSettings.maxRetry})`);
                 return this.requestApi(path, method, body, retryTime + 1);
             }
-            log.error(`Got ${response.status} status code, retrying failed!`);
+            this.logError(`Got ${response.status} status code, retrying failed!`);
             this.stop();
             throw new Error(`Got ${response.status} status code, retrying failed!`);
         }
         return response;
     }
 
     private async holdSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
         if (this.isHolded) return;
         const requestBody: HoldSlotPayload = {
             DateOfBirth: this.config.personalInfo.dob,
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
             Last4Ssn: this.config.personalInfo.lastFourSSN,
             SlotId: booking.SlotId,
         };
         const response = (await this.requestApi('/api/HoldSlot', 'POST', requestBody).then(res => res.data)) as HoldSlotResponse;
         if (response.SlotHeldSuccessfully !== true) {
-            log.error(`Failed to hold slot: ${response.ErrorMessage}`);
+            this.logError(`Failed to hold slot: ${response.ErrorMessage}`);
             if (this.queue.isPaused) this.queue.start();
             return;
         }
-        log.info('Slot hold successfully. Sleeping for 5s...');
+        this.logInfo('Slot hold successfully. Sleeping for 5s...');
         this.isHolded = true;
         await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
         await this.bookSlot(booking, location);
     }
 
     private async bookSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
         if (this.isBooked) return;
-        log.info('Booking slot....');
+        this.logInfo('Booking slot....');
         if (this.existBooking?.exist) {
-            log.info(`Canceling existing booking ${this.existBooking.response[0].ConfirmationNumber}`);
+            this.logInfo(`Canceling existing booking ${this.existBooking.response[0].ConfirmationNumber}`);
             await this.cancelBooking(this.existBooking.response[0].ConfirmationNumber);
         }
         const requestBody: BookSlotPayload = {
             AdaRequired: false,
             BookingDateTime: booking.StartDateTime,
             BookingDuration: booking.Duration,
             CardNumber: '',
             CellPhone: this.config.personalInfo.phoneNumber ? this.config.personalInfo.phoneNumber : '',
             DateOfBirth: this.config.personalInfo.dob,
             Email: this.config.personalInfo.email,
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
             HomePhone: '',
             Last4Ssn: this.config.personalInfo.lastFourSSN,
-            ResponseId: this.responseId,
+            ResponseId: this.responseId as number,
             SendSms: !!this.config.personalInfo.phoneNumber,
             ServiceTypeId: this.config.personalInfo.typeId || 71,
             SiteId: location.Id,
             SpanishLanguage: 'N',
         };
 
         const response = await this.requestApi('/api/NewBooking', 'POST', requestBody);
         if (response.status === 200) {
             const bookingInfo = response.data as BookSlotResponse;
             if (bookingInfo?.Booking === null) {
                 if (this.queue.isPaused) this.queue.start();
-                log.error('Failed to book slot');
-                log.error(JSON.stringify(bookingInfo));
+                this.logError('Failed to book slot');
+                this.logError(JSON.stringify(bookingInfo));
                 this.isHolded = false;
                 return;
             }
             const appointmentURL = `https://www.txdpsscheduler.com/?b=${bookingInfo.Booking.ConfirmationNumber}`;
             this.isBooked = true;
-            log.info(`Slot booked successfully. Confirmation Number: ${bookingInfo.Booking.ConfirmationNumber}`);
-            log.info(`Visiting this link to print your booking:`);
-            log.info(appointmentURL);
+            this.logInfo(`Slot booked successfully. Confirmation Number: ${bookingInfo.Booking.ConfirmationNumber}`);
+            this.logInfo(`Visiting this link to print your booking:`);
+            this.logInfo(appointmentURL);
             if (this.config.appSettings.pushNotifcation.enabled) {
-                log.info('Sending notification...');
+                this.logInfo('Sending notification...');
                 await pushNotifcation(`Booked for ${this.config.personalInfo.firstName} ${this.config.personalInfo.lastName}. URL: ${appointmentURL}`).catch(error => {
-                    log.error('Failed to send notification', error);
+                    this.logError('Failed to send notification', error);
                 });
             }
             this.stop();
             return;
         } else {
             if (this.queue.isPaused) this.queue.start();
-            log.error('Failed to book slot');
-            log.error(response.data);
+            this.logError('Failed to book slot');
+            this.logError(response.data);
         }
     }
 
     private async getAuthToken() {
         if (this.config.appSettings.captcha.strategy === 'solver') {
             const captchaToken = await this.getCaptchaToken();
             const requestBody: AuthPayload = {
                 RecaptchaToken: {
                     Action: 'login',
                     Token: captchaToken,
@@ -498,31 +517,31 @@ export class TexasScheduler extends EventEmitter {
                     LastName: this.config.personalInfo.lastName,
                     DateOfBirth: this.config.personalInfo.dob,
                     CardNumber: this.config.personalInfo.cardNumber || '',
                     LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
                 },
                 IsEmail: false,
                 IsMobile: true,
                 SelectedLanguage: 'EN',
             };
 
-            log.dev(`Captcha token: ${captchaToken}`);
-            log.dev(`Request body: ${JSON.stringify(requestBody)}`);
+            this.logDev(`Captcha token: ${captchaToken}`);
+            this.logDev(`Request body: ${JSON.stringify(requestBody)}`);
             const response = (await this.requestApi('/api/v1/account/auth', 'POST', requestBody).then(res => res.data)) as any;
             this.authToken = response.data.token;
         } else if (this.config.appSettings.captcha.strategy === 'browser') {
             try {
                 const response = await getAuthTokenFromBroswer();
                 const parsed = JSON.parse(response);
                 this.authToken = parsed.data.token;
             } catch (err) {
-                log.error('Browser auth failed. Waiting for manual token...');
+                this.logError('Browser auth failed. Waiting for manual token...');
                 this.emit('AUTH_REQUIRED');
                 await new Promise<void>((resolve, reject) => {
                     const onAbort = () => {
                         this.removeListener('manual_token_received', resolve);
                         reject(new Error('Aborted'));
                     };
                     if (this.abortController.signal.aborted) return onAbort();
                     this.abortController.signal.addEventListener('abort', onAbort);
                     this.once('manual_token_received', () => {
                         this.abortController.signal.removeEventListener('abort', onAbort);
@@ -543,50 +562,50 @@ export class TexasScheduler extends EventEmitter {
             this.authToken = response.token;
         }
 
         if (this.authToken) {
             writeFileSync('././cache/token.tmp', this.authToken);
         }
     }
 
     private async getCaptchaToken(taskId?: string | null, retries = 0): Promise<string> {
         if (retries > this.maxCaptchaSolverRetries) {
-            log.error(`Get captcha token failed after ${this.maxCaptchaSolverRetries} retries! will retry!`);
+            this.logError(`Get captcha token failed after ${this.maxCaptchaSolverRetries} retries! will retry!`);
             return await this.getCaptchaToken(null, 0);
         }
         if (!taskId) taskId = await CreateCaptchaSolverTask();
         const captchaResult = await this.getCaptchaResult(taskId);
         if (captchaResult === undefined) {
             await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal });
             return this.getCaptchaToken(taskId, retries + 1);
         }
         if (captchaResult === null) {
-            log.error('get captcha token failed! will create new task and sleep 10s!');
+            this.logError('get captcha token failed! will create new task and sleep 10s!');
             await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
             return this.getCaptchaToken(null, retries + 1);
         }
-        log.info('Captcha token received successfully');
+        this.logInfo('Captcha token received successfully');
         this.userAgent = captchaResult.userAgent;
         return captchaResult.captchaToken;
     }
 
     private async getCaptchaResult(taskId: string | null): Promise<CaptchaResult | undefined | null> {
         if (!taskId) return null;
-        log.info(`Waiting for captcha token from task ${taskId}...`);
+        this.logInfo(`Waiting for captcha token from task ${taskId}...`);
         try {
             const captchaResult = await GetCaptchaSolverResult(taskId);
             if (captchaResult.status !== 'ready') {
                 if (captchaResult.status === 'processing') return undefined;
                 else return null;
             }
             return {
                 captchaToken: captchaResult.solution.gRecaptchaResponse,
                 userAgent: captchaResult.solution.userAgent,
             };
         } catch (err) {
-            log.error('Error while getting captcha token: ', err as Error);
+            this.logError('Error while getting captcha token: ', err as Error);
             return null;
         }
     }
 }
 
 export default TexasScheduler;
diff --git a/backend/src/Interfaces/Config.ts b/backend/src/Interfaces/Config.ts
index df05aec..ed1390c 100644
--- a/backend/src/Interfaces/Config.ts
+++ b/backend/src/Interfaces/Config.ts
@@ -1,13 +1,13 @@
 import { z } from 'zod';
 
-const checkStartLowerThanEnd = data => data.start < data.end;
+const checkStartLowerThanEnd = (data: any) => data.start < data.end;
 
 const configZod = z.object({
     personalInfo: z.object({
         loadFromEnv: z.boolean().default(false),
         firstName: z.string(),
         lastName: z.string(),
         dob: z.string(),
         email: z.string(),
         lastFourSSN: z.string(),
         phoneNumber: z.string().optional().nullable(),
@@ -49,25 +49,25 @@ const configZod = z.object({
                         solverService: z.enum(['2captcha', 'capsolver']).optional(),
                         solverApiToken: z.string().optional(),
                     })
                     .optional()
                     .nullable(),
             })
             .optional()
             .nullable()
             .refine(
                 data => {
-                    if (data.strategy === 'browser' || data.strategy === 'manual') return true;
+                    if (data?.strategy === 'browser' || data?.strategy === 'manual') return true;
                     return (
-                        typeof data.solverOptions.solverService === 'string' &&
-                        typeof data.solverOptions.solverApiToken === 'string' &&
-                        data.solverOptions.solverApiToken.length > 0
+                        typeof data?.solverOptions?.solverService === 'string' &&
+                        typeof data?.solverOptions?.solverApiToken === 'string' &&
+                        data?.solverOptions?.solverApiToken.length > 0
                     );
                 },
                 {
                     message: 'If you want to use solver, please provide all required fields',
                 },
             ),
         pushNotifcation: z
             .object({
                 enabled: z.boolean().default(false),
                 baseURL: z.string().optional(),
diff --git a/backend/src/server.test.ts b/backend/src/server.test.ts
new file mode 100644
index 0000000..9cc8d8c
--- /dev/null
+++ b/backend/src/server.test.ts
@@ -0,0 +1,69 @@
+import test from 'node:test';
+import assert from 'node:assert';
+import request from 'supertest';
+import app from './server';
+import { TexasScheduler } from './Client';
+
+test('Express API Tests', async (t) => {
+    let jobId: string;
+
+    const originalRun = TexasScheduler.prototype.run;
+    t.beforeEach(() => {
+        TexasScheduler.prototype.run = async function() {
+            // Mock run to simulate pending job
+            return new Promise(() => {});
+        };
+    });
+
+    t.afterEach(() => {
+        TexasScheduler.prototype.run = originalRun;
+    });
+
+    await t.test('POST /api/schedule/start should start a job', async () => {
+        const res = await request(app)
+            .post('/api/schedule/start')
+            .send({ 
+                location: { zipCode: ['12345'], cityName: [] }, 
+                personalInfo: { firstName: 'John' },
+                appSettings: { maxExecutionTime: 1000 }
+            });
+
+        assert.strictEqual(res.status, 200);
+        assert.ok(res.body.jobId);
+        assert.strictEqual(res.body.status, 'started');
+        jobId = res.body.jobId;
+    });
+
+    await t.test('GET /api/schedule/logs/:jobId with invalid id', async () => {
+        const res = await request(app)
+            .get(`/api/schedule/logs/invalid_id`);
+        assert.strictEqual(res.status, 404);
+    });
+
+    await t.test('POST /api/schedule/token should accept token', async () => {
+        const res = await request(app)
+            .post('/api/schedule/token')
+            .send({ jobId, token: 'my_token' });
+            
+        assert.strictEqual(res.status, 200);
+        assert.strictEqual(res.body.status, 'token_accepted');
+    });
+
+    await t.test('POST /api/schedule/stop should stop job', async () => {
+        const res = await request(app)
+            .post('/api/schedule/stop')
+            .send({ jobId });
+            
+        assert.strictEqual(res.status, 200);
+        assert.strictEqual(res.body.status, 'stopped');
+    });
+
+    await t.test('POST /api/schedule/stop with invalid id', async () => {
+        const res = await request(app)
+            .post('/api/schedule/stop')
+            .send({ jobId: 'invalid_id' });
+            
+        assert.strictEqual(res.status, 404);
+        assert.strictEqual(res.body.error, 'Job not found');
+    });
+});
diff --git a/backend/src/server.ts b/backend/src/server.ts
new file mode 100644
index 0000000..4872eeb
--- /dev/null
+++ b/backend/src/server.ts
@@ -0,0 +1,108 @@
+import express from 'express';
+import cors from 'cors';
+import { v4 as uuidv4 } from 'uuid';
+import { TexasScheduler } from './Client';
+
+const app = express();
+app.use(cors());
+app.use(express.json());
+
+interface JobEntry {
+    scheduler: TexasScheduler;
+    timeoutHandle: NodeJS.Timeout;
+}
+const jobs: Record<string, JobEntry> = {};
+
+app.post('/api/schedule/start', async (req, res) => {
+    const config = req.body;
+    const jobId = uuidv4();
+    const scheduler = new TexasScheduler(config);
+
+    // Timeout after config max time (default 30 mins)
+    const maxTime = config.appSettings?.maxExecutionTime || 30 * 60 * 1000;
+    const timeoutHandle = setTimeout(() => {
+        if (jobs[jobId]) {
+            jobs[jobId].scheduler.stop();
+            delete jobs[jobId];
+        }
+    }, maxTime);
+
+    jobs[jobId] = { scheduler, timeoutHandle };
+
+    // Start asynchronously
+    scheduler.run().then(() => {
+        if (jobs[jobId]) {
+            clearTimeout(jobs[jobId].timeoutHandle);
+            delete jobs[jobId];
+        }
+    }).catch(err => {
+        console.error(err);
+        if (jobs[jobId]) {
+            clearTimeout(jobs[jobId].timeoutHandle);
+            delete jobs[jobId];
+        }
+    });
+
+    res.json({ jobId, status: 'started' });
+});
+
+app.post('/api/schedule/stop', (req, res) => {
+    const { jobId } = req.body;
+    if (jobs[jobId]) {
+        jobs[jobId].scheduler.stop();
+        clearTimeout(jobs[jobId].timeoutHandle);
+        delete jobs[jobId];
+        res.json({ status: 'stopped' });
+    } else {
+        res.status(404).json({ error: 'Job not found' });
+    }
+});
+
+app.post('/api/schedule/token', (req, res) => {
+    const { jobId, token } = req.body;
+    if (jobs[jobId]) {
+        jobs[jobId].scheduler.submitManualToken(token);
+        res.json({ status: 'token_accepted' });
+    } else {
+        res.status(404).json({ error: 'Job not found' });
+    }
+});
+
+app.get('/api/schedule/logs/:jobId', (req, res) => {
+    res.setHeader('Content-Type', 'text/event-stream');
+    res.setHeader('Cache-Control', 'no-cache');
+    res.setHeader('Connection', 'keep-alive');
+
+    const { jobId } = req.params;
+    const job = jobs[jobId];
+
+    if (!job) {
+        res.status(404).end();
+        return;
+    }
+
+    const logListener = (data: any) => {
+        res.write(`data: ${JSON.stringify(data)}\n\n`);
+    };
+
+    job.scheduler.on('log', logListener);
+
+    const authListener = () => {
+        res.write(`data: ${JSON.stringify({ type: 'AUTH_REQUIRED', message: 'Manual Auth Token Required' })}\n\n`);
+    };
+
+    job.scheduler.on('AUTH_REQUIRED', authListener);
+
+    req.on('close', () => {
+        job.scheduler.off('log', logListener);
+        job.scheduler.off('AUTH_REQUIRED', authListener);
+    });
+});
+
+const PORT = process.env.PORT || 3001;
+if (process.env.NODE_ENV !== 'test') {
+    app.listen(PORT, () => {
+        console.log(`Backend listening on port ${PORT}`);
+    });
+}
+export default app;
