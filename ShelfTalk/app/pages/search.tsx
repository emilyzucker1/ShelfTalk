import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchAndLog } from '../../scripts/book_search';
import { Book } from "../../scripts/openlib_lookup";


export default function TabTwoScreen() {
    const [data, setData] = useState<Book[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false) // if true show spinning indicator
    const router = useRouter()

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const results = await searchAndLog(searchQuery)
                setData(results);
            } catch (error) {
                console.log('Search error:', error)
                setData([])
            }
            setIsLoading(false)
        }
        if (searchQuery.length > 2) fetchBooks()
    }, [searchQuery])

    const filteredData = data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authors.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <View style={{ flex: 1, backgroundColor: '#E6F2F0' }}>
            <View style={{ backgroundColor: '#F4A896', padding: 16, paddingTop: 50 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 10, marginBottom: 16 }}>
                    <Text>🔍</Text>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search..."
                        style={{ flex: 1, padding: 8 }}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Top results</Text>

            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#F4A896" />
                </View>
            ) : (<FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                numColumns={4}
                style={{ padding: 8 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ flex: 1 / 4, padding: 4 }}
                        onPress={() => router.push(`/pages/book?id=${item.id}&title=${item.title}`)}
                    >
                        {item.coverUrl ? (
                            <Image source={{ uri: item.coverUrl }} style={{ width: '100%', aspectRatio: 2 / 3 }} />
                        ) : (
                            <View style={{ width: '100%', aspectRatio: 2 / 3, backgroundColor: '#ccc' }} />
                        )}
                        <Text numberOfLines={1} style={{ fontSize: 10 }}>{item.title}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 9, color: '#666' }}>{item.authors.join(', ')}</Text>
                    </TouchableOpacity>
                )}
            />
            )}
        </View >
    );
}


