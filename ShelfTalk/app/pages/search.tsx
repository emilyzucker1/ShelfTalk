import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addBookToShelf, addShelf, getUserShelves } from '../../hooks/use-shelves';
import { searchAndLog } from '../../scripts/book_search';
import { Book } from "../../scripts/openlib_lookup";

export default function TabTwoScreen() {
    const [data, setData] = useState<Book[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [shelves, setShelves] = useState<any[]>([])
    const [newShelfName, setNewShelfName] = useState('')

    const fetchShelves = async () => {
        try {
            const result = await getUserShelves()
            setShelves(result)
        } catch (error) {
            console.log('Shelves error:', error)
            setShelves([])
        }
    }

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

    useFocusEffect(
        useCallback(() => {
            fetchShelves()
        }, [])
    )

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authors.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    numColumns={4}
                    style={{ padding: 8 }}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1 / 4, padding: 4 }}>
                            {/* Book card - navigates to detail page */}
                            <TouchableOpacity
                                onPress={() => router.push(`/book?id=${item.id}&title=${item.title}`)}
                            >
                                {item.coverUrl ? (
                                    <Image source={{ uri: item.coverUrl }} style={{ width: '100%', aspectRatio: 2 / 3 }} />
                                ) : (
                                    <View style={{ width: '100%', aspectRatio: 2 / 3, backgroundColor: '#ccc' }} />
                                )}
                                <Text numberOfLines={1} style={{ fontSize: 10 }}>{item.title}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 9, color: '#666' }}>{item.authors.join(', ')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedBook(item)}
                                style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#F4A896', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <Modal
                visible={selectedBook !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedBook(null)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>Add to shelf</Text>
                        <Text style={{ color: '#666', marginBottom: 16 }}>{selectedBook?.title}</Text>

                        {shelves.length === 0 ? (
                            <Text style={{ color: '#999', marginBottom: 16 }}>You have no shelves yet.</Text>
                        ) : (
                            shelves.map(shelf => (
                                <TouchableOpacity
                                    key={shelf.id}
                                    onPress={async () => {
                                        try {
                                            await addBookToShelf(shelf.id, selectedBook!)
                                            await fetchShelves()
                                            setSelectedBook(null)
                                        } catch (error) {
                                            console.log('Add book to shelf error:', error)
                                            Alert.alert('Shelf update failed', 'We could not add this book to your shelf. Please try again.')
                                        }
                                    }}
                                    style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                >
                                    <Text style={{ fontSize: 16 }}>📚  {shelf.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}

                        {/* Create new shelf inline */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 }}>
                            <TextInput
                                value={newShelfName}
                                onChangeText={setNewShelfName}
                                placeholder="New shelf name..."
                                style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 }}
                            />
                            <TouchableOpacity
                                onPress={async () => {
                                    if (!newShelfName.trim()) return
                                    try {
                                        const id = await addShelf(newShelfName.trim())
                                        await fetchShelves()
                                        setShelves(prev => prev.some(shelf => shelf.id === id) ? prev : [...prev, { id, name: newShelfName.trim() }])
                                        setNewShelfName('')
                                    } catch (error) {
                                        console.log('Add shelf error:', error)
                                        Alert.alert('Shelf creation failed', 'We could not create that shelf. Please try again.')
                                    }
                                }}
                                style={{ backgroundColor: '#F4A896', borderRadius: 10, padding: 10 }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => setSelectedBook(null)}
                            style={{ marginTop: 16, alignItems: 'center' }}
                        >
                            <Text style={{ color: '#999' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );


}