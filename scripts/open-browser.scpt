
#########################################################################################
# This script will search all open Chrome Windows for a specified Tab (by Title)
# 
# If no tab with the given title is found, it will open the specified URL
# If multiple tabs with the specified title exist, the first one found will be opened
#
# Params
#		myTitle:   start of the tab title, as specified in the <title> tag
#		myURL:	   the url to open
#
# Example:
# osascript open-browser.scpt 'Start of tab title' 'folder/index.html'
#
# Credit: https://gist.github.com/wsoyka/8e0497379b9598dfe5116f04282247d1
# JavaScript version: https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/openBrowser.ts
#########################################################################################

on run argv
  set myTitle to item 1 of argv
  set myURL to item 2 of argv
  
  tell application "Google Chrome"
    activate
    set success to false		
    
    # Check if the tab is already open
    repeat with currentWindow in windows
      set tabIndex to 0
      repeat with currentTab in (tabs of currentWindow)			
        # If tab is open, focus it
        set tabIndex to tabIndex + 1
        # Check starts with: https://stackoverflow.com/a/5960510/1845423
        if title of currentTab starts with myTitle then
          # Set current tab active first, else it's ignored
          set (active tab index of currentWindow) to tabIndex
          # https://stackoverflow.com/a/34375804/1845423
          set index of currentWindow to 1
          delay 0.01
          do shell script "open -a Google\\ Chrome"
          # https://stackoverflow.com/q/17119184/1845423
          tell currentTab to reload
          set success to true
        end if
      end repeat
    end repeat
    
    # URL is not yet open, open new tab
    if success is false then
      # open location myURL
      do shell script "open -a Google\\ Chrome " & myURL
    end if
  end tell
end run
