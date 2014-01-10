/**
 * Camera Roll PhoneGap Plugin.
 *
 * Reads photos from the iOS Camera Roll.
 *
 * Copyright 2013 Drifty Co.
 * http://drifty.com/
 *
 * See LICENSE in this project for licensing info.
 */

#import "IonicCameraRoll.h"
#import <AssetsLibrary/ALAssetRepresentation.h>
#import <CoreLocation/CoreLocation.h>
#define CDV_PHOTO_PREFIX @"cdv_photo_"

@implementation IonicCameraRoll

+ (ALAssetsLibrary *)defaultAssetsLibrary {
    static dispatch_once_t pred = 0;
    static ALAssetsLibrary *library = nil;
    dispatch_once(&pred, ^{
        library = [[ALAssetsLibrary alloc] init];
    });
    
    // TODO: Dealloc this later?
    return library;
}

/**
 * Get all the photos in the library.
 *
 * TODO: This should support block-type reading with a set of images
 */
- (void)getPhotos:(CDVInvokedUrlCommand*)command
{
    
    // Grab the asset library
    ALAssetsLibrary *library = [IonicCameraRoll defaultAssetsLibrary];
    
    // Run a background job
    [self.commandDelegate runInBackground:^{
        
        // Enumerate all of the group saved photos, which is our Camera Roll on iOS
        [library enumerateGroupsWithTypes:ALAssetsGroupSavedPhotos usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
            
            // When there are no more images, the group will be nil
            if(group == nil) {
                
                // Send a null response to indicate the end of photostreaming
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:nil];
                [pluginResult setKeepCallbackAsBool:YES];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                
            } else {
                
                // Enumarate this group of images
                
                [group enumerateAssetsUsingBlock:^(ALAsset *result, NSUInteger index, BOOL *stop) {
                    
                    NSDictionary *urls = [result valueForProperty:ALAssetPropertyURLs];
                    
                    [urls enumerateKeysAndObjectsUsingBlock:^(id key, NSURL *obj, BOOL *stop) {

                        //NSString *imageName = [[result defaultRepresentation]filename];
                        //NSData* xxx = nil;
                        //NSURL* photoUrl = [[result valueForProperty:ALAssetPropertyURLs]objectForKey:[arrKeys objectAtIndex:0]];
                        //UIImage *Image = [UIImage imageWithCGImage:[[result defaultRepresentation] fullScreenImage]];
                        
                        UIImage *Image = [UIImage imageWithCGImage:[[result defaultRepresentation] fullScreenImage]];
                        
                        //UIImage *ThumbnailImage = [UIImage imageWithCGImage:[result thumbnail]];
                        //NSData *imageData = [NSData dataWithData:UIImagePNGRepresentation(ThumbnailImage)];
                        NSData *imageData = [NSData dataWithData:UIImageJPEGRepresentation(Image, 0.8)];
                        
                        NSError* err = nil;
                        NSString* docsPath = [NSTemporaryDirectory()stringByStandardizingPath];
                        //NSError* err = nil;
                        NSFileManager* fileMgr = [[NSFileManager alloc] init]; // recommended by apple (vs [NSFileManager defaultManager]) to be threadsafe
                        // generate unique file name
                        NSString* filePath;
                        
                        int i = 1;
                        do {
                            filePath = [NSString stringWithFormat:@"%@/%@%03d.%@", docsPath, CDV_PHOTO_PREFIX, i++,@"jpg"];
                        } while ([fileMgr fileExistsAtPath:filePath]);
                        
                      
                        // save file
                        CDVPluginResult *pluginResult;
                        if (![imageData writeToFile:filePath options:NSAtomicWrite error:&err]) {
                            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsString:[err localizedDescription]];
                        }
                        else {
                            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[NSURL fileURLWithPath:filePath] absoluteString]];
                        }
                        
                        
                        // Send the URL for this asset back to the JS callback
            // CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:obj.absoluteString];

                        [pluginResult setKeepCallbackAsBool:YES];
                        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                        
                    }];
                }];
            }
        } failureBlock:^(NSError *error) {
            // Ruh-roh, something bad happened.
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
    
}

@end

