// import { Test, TestingModule } from '@nestjs/testing';
// import { PostsService } from './posts.service';
// import { PrismaService } from '../prisma.service';
// import { NotFoundException } from '@nestjs/common';

// describe('PostsService', () => {
//   let postsService: PostsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [PostsService, PrismaService],
//     }).compile();

//     postsService = module.get<PostsService>(PostsService);
//   });

//   it('should be defined', () => {
//     expect(postsService).toBeDefined();
//   });

//   describe('createPost', () => {
//     it('should create a post successfully', async () => {
//       const prismaService = module.get<PrismaService>(PrismaService);
//       jest.spyOn(prismaService.post, 'create').mockResolvedValueOnce({} as any);

//       await expect(
//         postsService.createPost(1, 'Test Post'),
//       ).resolves.not.toThrow();
//     });
//   });

//   describe('updatePostExpirationStatus', () => {
//     it('should update post expiration status successfully', async () => {
//       // Mock the PrismaService's post.findMany and post.update methods
//       const prismaService = module.get<PrismaService>(PrismaService);
//       jest.spyOn(prismaService.post, 'findMany').mockResolvedValue([{}] as any);
//       jest.spyOn(prismaService.post, 'update').mockResolvedValueOnce({} as any);

//       await expect(
//         postsService.updatePostExpirationStatus(),
//       ).resolves.not.toThrow();
//     });
//   });

//   describe('verifyUser', () => {
//     it('should verify a user successfully', async () => {
//       // Mock the PrismaService's user.findUnique and user.update methods
//       const prismaService = module.get<PrismaService>(PrismaService);
//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({} as any);
//       jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce({} as any);

//       await expect(postsService.verifyUser(1)).resolves.not.toThrow();
//     });

//     it('should throw NotFoundException when user is not found', async () => {
//       const prismaService = module.get<PrismaService>(PrismaService);
//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

//       await expect(postsService.verifyUser(1)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });
//   });
// });
