import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { redirect } from "next/navigation"
import { User, LogOut, Clock, Heart, ListVideo, Settings } from "lucide-react"
import LogoutButton from "./components/LogoutButton"
import MiniCard from "../movies/components/MiniCard"
import FeaturedCard from "../movies/components/FeaturedCard"

export const revalidate = 0 // Never cache profile page, always dynamic

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      watchHistory: {
        include: {
          movie: {
            include: { genres: { include: { genre: true } } }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      },
      favorites: {
        include: {
          movie: true
        },
        orderBy: { addedAt: 'desc' }
      },
      watchlists: {
        include: {
          items: {
            include: { movie: true },
            orderBy: { addedAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect("/")
  }

  const initial = user.username ? user.username.charAt(0).toUpperCase() : "U"

  return (
    <div className="min-h-screen bg-background text-white pb-20 pt-24 px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* User Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent to-accent/50 flex items-center justify-center text-5xl font-bold shadow-xl shadow-accent/20 flex-shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
            <p className="text-white/50 mb-6 flex items-center justify-center md:justify-start gap-2">
              <User className="w-4 h-4" />
              {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
              <LogoutButton />
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{user.watchHistory.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Watched</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{user.favorites.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Favorites</div>
            </div>
          </div>
        </div>

        {/* Continue Watching */}
        {user.watchHistory.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-accent" />
              Continue Watching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {user.watchHistory.slice(0, 4).map(history => (
                <div key={history.id} className="col-span-1">
                  <FeaturedCard 
                    movie={history.movie} 
                    progress={{ watchedSeconds: history.watchedSeconds, totalSeconds: history.totalSeconds }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {user.favorites.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-accent fill-accent" />
              My Favorites
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              {user.favorites.map(fav => (
                <MiniCard key={fav.movieId} movie={fav.movie} />
              ))}
            </div>
          </div>
        )}

        {/* Watchlists */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <ListVideo className="w-6 h-6 text-accent" />
            My Watchlists
          </h2>
          {user.watchlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.watchlists.map(list => (
                <div key={list.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <h3 className="text-lg font-medium mb-1 group-hover:text-accent transition-colors">{list.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{list.items.length} items</p>
                  <div className="flex -space-x-4 overflow-hidden">
                    {list.items.slice(0, 4).map(item => (
                      item.movie.posterUrl ? (
                        <img 
                          key={item.movieId} 
                          src={item.movie.posterUrl} 
                          alt="poster" 
                          className="inline-block h-16 w-12 rounded-md ring-2 ring-[#0f0f11] object-cover"
                        />
                      ) : null
                    ))}
                    {list.items.length === 0 && (
                      <div className="text-sm text-white/30 italic">Empty list</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/40">
              You haven't created any watchlists yet.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}