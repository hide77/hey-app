# FULL_SOCKET
FULL_SOCKET means that we join all chatrooms at once on app launch. The benefit is that everything is instantaneous. It might make the app slower if user joins thousands of rooms with thousands of users chatting instantly.

// implementation
x make it an on-off switch
- add a backend config file to change app behaviour instantly without having to go through the corresponding stores
- update the subscriptions
- update corresponding chatrooms on localstorage

// testing (on staging server)
- generate thousands of ChatRooms
- generate thousands of users
- generate thousands of interactions
- measure in both cases what is the best scenario

# OPTIMISATION
- soft update the subscriptions and only render when required

# TODO
- refactor from react-navigation to react-native-navigation
- cache chat history on localstorage
- store user theme in profile
- notifications: update view when theme is changed / restart app when theme is changed
- infinite scroll for messages for faster loading
- sparkpost new release mail
- sockets private messages
- handle empty trending
- onboarding screen
- select hashtags on account creation
- photo access refused: explain how to turn it back on
- explain tokens
- disable longpress if chat is not joined
- list followers
- list following
- tag user in chat
- scroll to message
- !hasMore subs indicator overflow
- chatroom notifications
- loading indicator subs
- complete i18n
- update create hashtag api, add owner
- if no owner hide owner part
- add a description and image when creating a hashtag
- autocomplete images with google ?
- allow admin to change hashtag name but only of lowercase is the same
- review redux store architecture
