# MongoDB Atlas Cloud Configuration

## Connection Details

The PersonaLens backend is configured to use **MongoDB Atlas** (cloud database) instead of a local MongoDB instance.

### Database Information
- **Service**: MongoDB Atlas (Cloud)
- **Database Name**: `coconut_analytics`
- **Connection Type**: `mongodb+srv://` (MongoDB Atlas serverless)

### Configuration

The MongoDB URI is configured in the `.env` file:

```env
MONGODB_URI=mongodb+srv://sadumina:Sadumina2003@sadumina.c82ip.mongodb.net/coconut_analytics?retryWrites=true&w=majority
DATABASE_NAME=coconut_analytics
```

### Important Notes

1. **No Local MongoDB Required**: The application connects directly to MongoDB Atlas, so you don't need to run a local MongoDB instance.

2. **Internet Connection Required**: Since the database is cloud-hosted, an active internet connection is required for the backend to function.

3. **IP Whitelist**: Make sure your IP address is whitelisted in MongoDB Atlas settings:
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add your current IP address or use `0.0.0.0/0` (allow from anywhere) for development

4. **Connection String Security**: The connection string contains credentials. In production:
   - Never commit actual credentials to public repositories
   - Use environment variables
   - Rotate credentials regularly

### Switching to Local MongoDB (Optional)

If you need to use a local MongoDB instance instead:

1. **Start local MongoDB**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password \
     mongo:7
   ```

2. **Update .env**:
   ```env
   MONGODB_URI=mongodb://admin:password@localhost:27017
   DATABASE_NAME=coconut_analytics
   ```

### Troubleshooting

**Connection Timeout Errors**:
- Check your internet connection
- Verify IP whitelist in MongoDB Atlas
- Check if the credentials are correct

**Authentication Failed**:
- Verify username and password in the connection string
- Check if the database user has proper permissions

**Database Not Found**:
- MongoDB will create the database automatically on first write operation
- Make sure DATABASE_NAME matches the database in the connection string

### Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Atlas IP Whitelist](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
