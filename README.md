<p align="center">
    <img src="/public/logo.svg"/>
</p>

---

[简体中文](./README-zh.md) | English

# Avatar-Clipper Lightweight avatar cropping tool

Avatar clipper is a lightweight avatar cropping tool developed based on Konva, supporting TypeScript. Its core architecture adopts Command and EventBus modules, providing concise API operations and flexible event callback mechanisms. The tool supports special features such as image loading, cropping box interaction, watermark addition, and dark part effects, and can export cropping results in multiple formats. Compared to existing solutions, Avatar Clipper is more lightweight while maintaining complete functionality, without binding any UI components. The core library packaging results are only over 200 kb, and the core clipping function is only implemented through APIs, making it suitable for various scenarios such as social media and e-commerce.

---

**Results show**

<p align="center">
    <img src="/public/result.gif"/>
</p>

## Experience

[📖 Official documents](https://pushu-wf.github.io/)

[🎉 Official website experience address](https://pushu-wf.github.io/quick-start/online/)

[🔗 Alternate address: stackblitz](https://stackblitz.com/~/github.com/pushu-wf/avatar-clipper)

## Event

| Event Name                                                                  |            Description             |                                    Returns |
| --------------------------------------------------------------------------- | :--------------------------------: | -----------------------------------------: |
| [afterInit](https://pushu-wf.github.io/quick-start/eventbus/#afterinit)     | Container initialization completed | Crop result upon initialization completion |
| [imageLoaded](https://pushu-wf.github.io/quick-start/eventbus/#imageloaded) |    Set image loading completed     |                           Image Properties |
| [imageError](https://pushu-wf.github.io/quick-start/eventbus/#imageerror)   |   Image setting failed callback    |                             failure reason |
| [imageUpdate](https://pushu-wf.github.io/quick-start/eventbus/#imageupdate) |       Image update callback        |                           Image Properties |
| [preview](https://pushu-wf.github.io/quick-start/eventbus/#preview)         |            Live Preview            |                    Preview Results(string) |

## Command

| Command                                                                                      |         Description         |                                                                    Returns |
| -------------------------------------------------------------------------------------------- | :-------------------------: | -------------------------------------------------------------------------: |
| [clearImage](https://pushu-wf.github.io/quick-start/command/#clearimage)                     |         Clear image         |                                                                         无 |
| [reset](https://pushu-wf.github.io/quick-start/command/#reset)                               |      Reset components       |                                                                         无 |
| [destroy](https://pushu-wf.github.io/quick-start/command/#destroy)                           |  Destruction of components  |                                                                         无 |
| [getImageAttrs](https://pushu-wf.github.io/quick-start/command/#getimageattrs)               |  Retrieve image attributes  | [ImageAttrs](https://pushu-wf.github.io/quick-start/interface/#imageattrs) |
| [getResult](https://pushu-wf.github.io/quick-start/command/#getresult)                       |  Obtain screenshot results  |                                        string \| Blob \| HTMLCanvasElement |
| [updateClipperOptions](https://pushu-wf.github.io/quick-start/command/#updateclipperoptions) |   Update clipper options    |                                                                         无 |
| [setImage](https://pushu-wf.github.io/quick-start/command/#setimage)                         |         Set Picture         |                                                                         无 |
| [updateCropAttrs](https://pushu-wf.github.io/quick-start/command/#updatecropattrs)           | Update Crop Box Properties  |                                                                         无 |
| [updateImageAttrs](https://pushu-wf.github.io/quick-start/command/#updateimageattrs)         |   Update image properties   |                                                                         无 |
| [updateWatermarkAttrs](https://pushu-wf.github.io/quick-start/command/#updatewatermarkattrs) | Update watermark properties |                                                                         无 |

## Guidelines for operating background images

1. Translation `Roller (Move up and down)` `Roller + Shift (Move left and right)`
2. Scale `Roller + Ctrl (Zoom in and out)`
3. Drag `Drag (Up, down, left, right)`

## Notice on Cross Domain Image Request

```ts
// Konva Image Cross domain processing for image creation
const imageElement = new Image();

// Parse Image Source
const source = await parseImageSource(image);

// Add cross domain processing crossOrigin = Anonymous
imageElement.crossOrigin = "Anonymous";

// set image source
imageElement.src = source;
```

This instance has added cross domain compatibility when creating images, and this method is only effective when the requested domain has an Access Control Allow Origin header that allows sharing requests. If it doesn't work, then you must configure your server in a different way (it's beyond Konva's scope), or you can try storing the image in another location that supports CORS requests.

## Co creation Plan

1. Welcome everyone to raise [issue](https://gitee.com/wfeng0/avatar-clipper/issues/new);
2. Welcome everyone to raise [PR](https://gitee.com/wfeng0/avatar-clipper/pulls/new)，Welcome everyone to fork the project;
3. Welcome everyone to join the discussion group:

<img src='/public/qq-group.png'/>
