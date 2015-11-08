//
//  ViewController.swift
//  JetBlueApp
//
//  Created by Cameron Averill on 11/8/15.
//  Copyright (c) 2015 Cameron Averill. All rights reserved.
//

import UIKit
import FBSDKCoreKit
import FBSDKLoginKit

class ViewController: UIViewController, FBSDKLoginButtonDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        if (FBSDKAccessToken.currentAccessToken() == nil){
            println("Not logged in.")
        }
        else{
            println("Logged in.")
            self.performSegueWithIdentifier("showNew", sender: self)
        }
        
        var loginButton = FBSDKLoginButton()
        loginButton.readPermissions = ["public_profile", "email", "user_friends"]
        loginButton.center = self.view.center
        
        loginButton.delegate = self
        
        self.view.addSubview(loginButton)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Facebook login methods
    func loginButton(loginButton: FBSDKLoginButton!, didCompleteWithResult result: FBSDKLoginManagerLoginResult!, error: NSError!) {
        if(error == nil){
            println("Login complete.")
            // Get List Of Friends
            var friendsRequest : FBRequest = FBRequest.requestForMyFriends()
            friendsRequest.startWithCompletionHandler{(connection:FBRequestConnection!, result:AnyObject!, error:NSError!) -> Void in
                var resultdict = result as NSDictionary
                println("Result Dict: \(resultdict)")
                var data : NSArray = resultdict.objectForKey("data") as NSArray
                
                for i in 0..&lt;data.count {
                    let valueDict : NSDictionary = data[i] as NSDictionary
                    let id = valueDict.objectForKey("id") as String
                    println("the id value is \(id)")
                }
                
                var friends = resultdict.objectForKey("data") as NSArray
                println("Found \(friends.count) friends")
            }
            self.performSegueWithIdentifier("showNew", sender: self)
        }
        else{
            println(error.localizedDescription)
        }
    }
    
    func loginButtonDidLogOut(loginButton: FBSDKLoginButton!) {
        println("User logged out...")
    }
    
    

}

